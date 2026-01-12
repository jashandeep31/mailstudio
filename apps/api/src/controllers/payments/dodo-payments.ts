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
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: "test_mode", // defaults to 'live_mode'
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
      product_cart: [{ product_id: "pdt_0NW3JXP572Os6xSYT6Hio", quantity: 1 }],
      subscription_data: {},
      customer: {
        email: req.user.email,

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

// cks_0NW808U0cHlGP2pgTLXuM
export const handleDodoPaymentWebhook = catchAsync(
  async (req: Request, res: Response) => {
    if (req.body.type === "payment.succeeded") {
      console.log(req.body.data.metadata.user_id);
      const bodyData = req.body;
      const orderId = req.body.data.metadata.order_id;
      const [userPlan] = await db
        .select()
        .from(plansTable)
        .where(eq(plansTable.user_id, req.body.data.metadata.user_id));
      if (!userPlan) {
        console.log(`we fucked up here iwht user`);

        res.status(200).json({});
        return;
      }
      // checking the if payment is already made
      const [oldPayment] = await db
        .select()
        .from(paymentTransactionsTable)
        .where(eq(paymentTransactionsTable.invoice_id, orderId));
      if (oldPayment) {
        console.log(`we fucked up here`);
        res.status(200).json({});
        return;
      }
      const subscripton = await client.subscriptions.retrieve(
        req.body.data.subscription_id,
      );

      await db.transaction(async (tx) => {
        const [paymentTransaction] = await tx
          .insert(paymentTransactionsTable)
          .values({
            user_id: bodyData.data.metadata.user_id,
            provider: "dodopayments",
            invoice_id: orderId,
            payment_id: bodyData.data.payment_id,
            subscription_id: bodyData.data.subscription_id,
            checkout_session_id: bodyData.data.checkout_session_id,

            settlement_amount: String(bodyData.data.settlement_amount / 100),
            tax_amount: String(bodyData.data.settlement_tax / 100),

            payment_method: bodyData.data.payment_method,
            card_last_four: bodyData.data.card_last_four,
            card_network: bodyData.data.card_network,
            card_type: bodyData.data.card_type,

            status: bodyData.data.status,
            error_message: null,
            error_code: null,
            provider_metadata: bodyData,
          })
          .returning();
        if (!paymentTransaction) {
          throw new AppError("Payment transaction not created", 500);
        }
        await tx.insert(billingsTable).values({
          user_id: bodyData.data.metadata.user_id,
          amount: String(bodyData.data.settlement_amount / 100),
          payment_transaction_id: paymentTransaction.id,
          plan_type: "starter_pack",
        });

        await tx
          .update(plansTable)
          .set({
            updated_at: new Date(),
            plan_type: "starter_pack",
            subscription_id: bodyData.data.subscription_id,
            active: true,
            price: String(subscripton.recurring_pre_tax_amount / 100),
            active_from: new Date(subscripton.created_at),
            renew_at: new Date(subscripton.next_billing_date),
            ends_at: subscripton.cancel_at_next_billing_date
              ? new Date(subscripton.next_billing_date)
              : null,
            cancel_at_next_billing_date:
              subscripton.cancel_at_next_billing_date || false,
          })
          .where(eq(plansTable.user_id, bodyData.data.metadata.user_id));

        const [oldWallet] = await tx
          .select()
          .from(creditWalletsTable)
          .where(eq(creditWalletsTable.user_id, bodyData.data.metadata.user_id))
          .limit(1);
        if (!oldWallet) {
          throw new AppError("Wallet not found", 500);
        }
        await tx
          .update(creditWalletsTable)
          .set({
            updated_at: new Date(),
            balance: String(
              Number(oldWallet.balance) +
                subscripton.recurring_pre_tax_amount / 100,
            ),
          })
          .where(eq(creditWalletsTable.user_id, bodyData.data.metadata.user_id))
          .returning();
        if (Number(oldWallet.balance) > 0) {
          await tx.insert(creditTransactionsTable).values({
            user_id: bodyData.data.metadata.user_id,
            wallet_id: oldWallet.id,
            amount: String(subscripton.recurring_pre_tax_amount / 100),
            after_balance: "0.00",
            before_balance: oldWallet.balance,
            type: "expire",
            reason: "Previous Plan Upgrade",
          });
        }
        await tx.insert(creditTransactionsTable).values({
          user_id: bodyData.data.metadata.user_id,
          wallet_id: oldWallet.id,
          amount: String(subscripton.recurring_pre_tax_amount / 100),
          after_balance: String(
            Number(oldWallet.balance) +
              subscripton.recurring_pre_tax_amount / 100,
          ),
          before_balance: oldWallet.balance,
          type: "grant",
          reason: "Plan Upgrade",
        });
      });
    }
    res.status(200).json({});
    return;
  },
);

// TODO: create the cancel and resume plan
