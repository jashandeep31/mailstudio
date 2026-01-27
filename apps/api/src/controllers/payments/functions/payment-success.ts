import {
  db,
  plansTable,
  paymentTransactionsTable,
  eq,
  billingsTable,
  creditWalletsTable,
  creditTransactionsTable,
} from "@repo/db";
import DodoPayments from "dodopayments";
import { Response } from "express";
import { dodoPaymentClient } from "../dodo-payments.js";
import { env } from "../../../lib/env.js";
import { AppError } from "../../../lib/app-error.js";
import { revalidateUserCreditWalletCache } from "../../../lib/redis/user-credit-wallet-cache.js";

export const handlePaymentSuccessWebhook = async ({
  event,
  res,
}: {
  event: DodoPayments.Webhooks.PaymentSucceededWebhookEvent;
  res: Response;
}) => {
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

  const subscription =
    await dodoPaymentClient.subscriptions.retrieve(subscriptionId);
  const productId = subscription.product_id;
  const settlementAmount = paymentData.settlement_amount / 100;
  const taxAmount = (paymentData.settlement_tax ?? 0) / 100;
  const price = subscription.recurring_pre_tax_amount / 100;

  const newCredits = productId == env.DODO_STARTER_PRODUCT_ID ? 10 : 0;

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
        price: String(price),
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
        type: "expire",
        reason: "Previous Plan Upgrade - Balance exceeds 10 credits",
      });
    }

    await tx.insert(creditTransactionsTable).values({
      user_id: userId,
      wallet_id: wallet.id,
      amount: String(newCredits),
      after_balance: String(newBalance),
      type: "grant",
      reason: "Plan Upgrade",
    });
  });
  await revalidateUserCreditWalletCache(null, userId);
};
