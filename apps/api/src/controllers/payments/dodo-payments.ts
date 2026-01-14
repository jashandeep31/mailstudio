import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import DodoPayments from "dodopayments";
import {
  billingsTable,
  creditTransactionsTable,
  creditWalletsTable,
  db,
  eq,
  paymentTransactionsTable,
  plansTable,
  usersTable,
} from "@repo/db";
import { env } from "../../lib/env.js";
import { v4 as uuid } from "uuid";

const client = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: env.DODO_PAYMENTS_ENVIRONMENT,
  webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
});

export const getProSubscriptonUrl = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const orderId = uuid();
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));
    if (!user) throw new AppError("User not found", 404);
    const paymentSession = await client.checkoutSessions.create({
      product_cart: [{ product_id: env.DODO_STARTER_PRODUCT_ID, quantity: 1 }],
      subscription_data: {},
      customer: {
        // TODO: remove this while moving to the production
        email: (() => {
          if (env.DODO_PAYMENTS_ENVIRONMENT == "test_mode") {
            return (
              req.user.email.split("@")[0]! +
              Math.floor(Math.random() * 1000) +
              "@" +
              req.user.email.split("@")[1]!
            );
          }
          return req.user.email;
        })(),

        name: (user.firstName + " " + user.lastName).trim(),
      },
      metadata: {
        user_id: user.id,
        source: "web",
        plan: "starter",
        order_id: orderId,
      },
      return_url: `${env.FRONTEND_URL}/payment-success`,
    });

    res.status(200).json({
      data: {
        url: paymentSession.checkout_url,
      },
    });

    return;
  },
);

export const dodoCustomerSession = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const [userPlan] = await db
      .select()
      .from(plansTable)
      .where(eq(plansTable.user_id, req.user.id));
    if (!userPlan || !userPlan.customer_id) {
      throw new AppError("Feature is not accesible for a time being ", 500);
    }
    const customerPortalSession = await client.customers.customerPortal.create(
      userPlan.customer_id,
    );
    res.status(200).json({
      data: {
        url: customerPortalSession.link,
      },
    });
    return;
  },
);

export const handleDodoPaymentWebhook = catchAsync(
  async (req: Request, res: Response) => {
    const event = client.webhooks.unwrap(req.body.toString(), {
      headers: {
        "webhook-id": req.headers["webhook-id"] as string,
        "webhook-signature": req.headers["webhook-signature"] as string,
        "webhook-timestamp": req.headers["webhook-timestamp"] as string,
      },
    });

    if (event.type !== "payment.succeeded") {
      res.status(200).json({ received: true });
      return;
    }

    const paymentData = event.data;
    const userId = paymentData.metadata.user_id;
    const orderId = paymentData.metadata.order_id;
    const subscriptionId = paymentData.subscription_id;
    const customerId = paymentData.customer.customer_id;

    if (!userId || !orderId || !subscriptionId) {
      console.error("Missing required metadata in webhook payload");
      res.status(200).json({ received: true });
      return;
    }

    const [userPlan] = await db
      .select()
      .from(plansTable)
      .where(eq(plansTable.user_id, userId));
    if (!userPlan) {
      console.error(`User plan not found for user: ${userId}`);
      res.status(200).json({ received: true });
      return;
    }

    const [existingPayment] = await db
      .select()
      .from(paymentTransactionsTable)
      .where(eq(paymentTransactionsTable.invoice_id, orderId));
    if (existingPayment) {
      console.warn(`Duplicate payment detected for order: ${orderId}`);
      res.status(200).json({ received: true });
      return;
    }

    const subscription = await client.subscriptions.retrieve(subscriptionId);

    const settlementAmount = paymentData.settlement_amount / 100;
    const taxAmount = (paymentData.settlement_tax ?? 0) / 100;
    const newCredits = subscription.recurring_pre_tax_amount / 100;

    await db.transaction(async (tx) => {
      const [paymentTransaction] = await tx
        .insert(paymentTransactionsTable)
        .values({
          user_id: userId,
          provider: "dodopayments",
          invoice_id: orderId,
          payment_id: paymentData.payment_id,
          subscription_id: subscriptionId,
          customer_id: customerId,
          checkout_session_id: paymentData.checkout_session_id,
          settlement_amount: String(settlementAmount),
          tax_amount: String(taxAmount),
          payment_method: paymentData.payment_method,
          card_last_four: paymentData.card_last_four,
          card_network: paymentData.card_network,
          card_type: paymentData.card_type,
          status: paymentData.status as "pending",
          error_message: null,
          error_code: null,
          provider_metadata: event,
        })
        .returning();

      if (!paymentTransaction) {
        throw new AppError("Payment transaction not created", 500);
      }

      await tx.insert(billingsTable).values({
        user_id: userId,
        amount: String(settlementAmount),
        payment_transaction_id: paymentTransaction.id,
        plan_type: "starter_pack",
      });

      await tx
        .update(plansTable)
        .set({
          updated_at: new Date(),
          plan_type: "starter_pack",
          subscription_id: subscriptionId,
          customer_id: customerId,
          active: true,
          price: String(newCredits),
          active_from: new Date(subscription.created_at),
          renew_at: new Date(subscription.next_billing_date),
          ends_at: subscription.cancel_at_next_billing_date
            ? new Date(subscription.next_billing_date)
            : null,
          cancel_at_next_billing_date:
            subscription.cancel_at_next_billing_date || false,
        })
        .where(eq(plansTable.user_id, userId));

      const [wallet] = await tx
        .select()
        .from(creditWalletsTable)
        .where(eq(creditWalletsTable.user_id, userId))
        .limit(1);

      if (!wallet) {
        throw new AppError("Wallet not found", 500);
      }

      const oldBalance = Number(wallet.balance);
      const carriedOverBalance = Math.min(oldBalance, 10);
      const expiredAmount = oldBalance > 10 ? oldBalance - 10 : 0;
      const newBalance = carriedOverBalance + newCredits;

      await tx
        .update(creditWalletsTable)
        .set({
          updated_at: new Date(),
          balance: String(newBalance),
        })
        .where(eq(creditWalletsTable.user_id, userId));

      if (expiredAmount > 0) {
        await tx.insert(creditTransactionsTable).values({
          user_id: userId,
          wallet_id: wallet.id,
          amount: String(expiredAmount),
          after_balance: String(carriedOverBalance),
          before_balance: wallet.balance,
          type: "expire",
          reason: "Previous Plan Upgrade - Balance exceeds 10 credits",
        });
      }

      await tx.insert(creditTransactionsTable).values({
        user_id: userId,
        wallet_id: wallet.id,
        amount: String(newCredits),
        after_balance: String(newBalance),
        before_balance: String(carriedOverBalance),
        type: "grant",
        reason: "Plan Upgrade",
      });
    });

    res.status(200).json({ received: true });
  },
);
