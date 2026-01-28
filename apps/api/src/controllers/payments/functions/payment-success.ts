import {
  db,
  plansTable,
  paymentTransactionsTable,
  eq,
  billingsTable,
} from "@repo/db";
import DodoPayments from "dodopayments";
import { Response } from "express";
import { AppError } from "../../../lib/app-error.js";
import { getPlanInfo } from "../../../lib/get-user-info.js";
import { dodoPaymentClient } from "../dodo-payments.js";

/**
 * Objectives of this function:
 * 1. Record the payment transaction
 * 2. Create billing record
 * 3. Handle idempotency (prevent duplicate payments if webhook strikes twice)
 * 4. DO NOT handle subscription status, credits, or plan updates (handled by subscription.active webhook)
 */
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

  if (!subscriptionId) return;
  const subscription =
    await dodoPaymentClient.subscriptions.retrieve(subscriptionId);
  if (!subscription) return;

  const plan = getPlanInfo(subscription.product_id);
  if (!plan) return;

  if (!userId || !orderId) {
    console.error("Missing required metadata in webhook payload");
    res.status(200).json({ received: true });
    return;
  }

  // Verify user exists
  const [userPlan] = await db
    .select()
    .from(plansTable)
    .where(eq(plansTable.user_id, userId));

  if (!userPlan) {
    console.error(`User plan not found for user: ${userId}`);
    res.status(200).json({ received: true });
    return;
  }

  const settlementAmount = paymentData.settlement_amount / 100;
  const taxAmount = (paymentData.settlement_tax ?? 0) / 100;

  await db.transaction(async (tx) => {
    // Lock the user's plan to prevent race conditions
    const [lockedPlan] = await tx
      .select()
      .from(plansTable)
      .where(eq(plansTable.user_id, userId))
      .for("update");

    if (!lockedPlan) {
      throw new AppError("User plan not found", 404);
    }

    // Check if this payment has already been processed (idempotency check)
    const [existingPayment] = await tx
      .select()
      .from(paymentTransactionsTable)
      .where(eq(paymentTransactionsTable.payment_id, paymentData.payment_id));

    if (existingPayment) {
      console.log(
        `Payment already processed: ${paymentData.payment_id}, skipping`,
      );
      return;
    }

    // Insert payment transaction record
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
      throw new AppError("Failed to create payment transaction", 500);
    }

    // Create billing record
    await tx.insert(billingsTable).values({
      user_id: userId,
      amount: String(settlementAmount),
      payment_transaction_id: paymentTransaction.id,
      plan_type: plan.name, // Get from metadata if available
    });

    console.log(
      `Payment processed successfully for user ${userId}, payment ${paymentData.payment_id}`,
    );
  });

  res.status(200).json({ received: true });
};
