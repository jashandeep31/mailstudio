import { Response } from "express";
import DodoPayments from "dodopayments";
import { db, plansTable, eq, planTypeEnum } from "@repo/db";
import { env } from "../../../lib/env.js";

export const handleSubscriptionActiveWebhook = async ({
  event,
}: {
  event: DodoPayments.Webhooks.SubscriptionActiveWebhookEvent;
  res: Response;
}) => {
  const data = event.data;
  const metadata = data.metadata;

  const userId = metadata.user_id; // userid that user order
  const orderId = metadata.order_id; // random uuid
  const subscriptionId = data.subscription_id;
  const customerId = data.customer.customer_id;

  if (!userId || !orderId || !subscriptionId || !customerId) return;

  const [userPlan] = await db
    .select()
    .from(plansTable)
    .where(eq(plansTable.user_id, userId));

  if (!userPlan) {
    console.error(`User plan not found for user: ${userId}`);
    return;
  }

  const productId = data.product_id;
  const preTaxAmount = data.recurring_pre_tax_amount / 100;
  const plan = getPlan(productId);
  if (!plan) return;

  await db
    .update(plansTable)
    .set({
      plan_type: plan.name,
      subscription_id: subscriptionId,
      subscription_status: "active",
      customer_id: customerId,
      price: String(preTaxAmount),
      active_from: new Date(data.created_at),
      renew_at: new Date(data.next_billing_date),
      ends_at: data.cancel_at_next_billing_date
        ? new Date(data.next_billing_date)
        : data.expires_at
          ? new Date(data.expires_at)
          : null,
      cancel_at_next_billing_date: data.cancel_at_next_billing_date || false,
    })
    .where(eq(plansTable.user_id, userId));
};

// Getting the current user plan
const getPlan = (
  productId: string,
): {
  name: (typeof planTypeEnum.enumValues)[number];
  creditsCount: number;
} | null => {
  if (productId === env.DODO_PRODUCT_PRO)
    return {
      name: "pro",
      creditsCount: 10,
    };
  else if (productId === env.DODO_PRODUCT_PRO_PLUS)
    return {
      name: "pro_plus",
      creditsCount: 20,
    };
  return null;
};
