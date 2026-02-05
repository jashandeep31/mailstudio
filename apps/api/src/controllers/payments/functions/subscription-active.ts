import DodoPayments from "dodopayments";
import {
  db,
  plansTable,
  eq,
  creditsGrantsTable,
  creditWalletsTable,
  sql,
  and,
} from "@repo/db";
import { revalidateUserCreditWalletCache } from "../../../lib/redis/user-credit-wallet-cache.js";
import { getPlanInfo } from "../../../lib/get-plan-info.js";

/**
  Objectives of this function 
  1. Handle the sub active only 
  2. Make the user sub active as per webhook data no manual calculation  should have to be their 
  3. Don't handle anything of billing or payment that will get handled by the payment.succeses or the other alternate controllers 
  */

export const handleSubscriptionActiveWebhook = async ({
  event,
}: {
  event: DodoPayments.Webhooks.SubscriptionActiveWebhookEvent;
}) => {
  const data = event.data;
  const metadata = data.metadata;

  const userId = metadata.user_id;
  const orderId = metadata.order_id;
  const subscriptionId = data.subscription_id;
  const customerId = data.customer.customer_id;

  if (!userId || !orderId || !subscriptionId || !customerId) {
    console.error("Missing required metadata in subscription active webhook");
    return;
  }

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
  const plan = getPlanInfo(productId);
  if (!plan) return;

  // Things taking place here
  // 1. updating the user sub plan
  // 2. Updating the user credits wallet
  // 3. Creating the new etnry to wallet grants table so that we can keep track when to remove insert

  await db.transaction(async (tx) => {
    const [lockedPlan] = await tx
      .select()
      .from(plansTable)
      .where(eq(plansTable.user_id, userId))
      .for("update"); // This creates a row-level lock

    if (!lockedPlan) {
      console.error(`User plan not found for user: ${userId}`);
      return;
    }

    const [existingGrant] = await tx
      .select()
      .from(creditsGrantsTable)
      .where(
        and(
          eq(creditsGrantsTable.expires_at, new Date(data.next_billing_date)),
          eq(creditsGrantsTable.user_id, userId),
          eq(creditsGrantsTable.type, "monthly"),
        ),
      );
    if (existingGrant) return;
    await tx
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
        updated_at: new Date(),
      })
      .where(eq(plansTable.user_id, userId));

    const [wallet] = await tx
      .update(creditWalletsTable)
      .set({
        balance: sql`${creditWalletsTable.balance} + ${plan.creditsCount}`,
        updated_at: new Date(),
      })
      .where(eq(creditWalletsTable.user_id, userId))
      .returning();

    if (!wallet) return;

    await tx.insert(creditsGrantsTable).values({
      user_id: userId,
      wallet_id: wallet.id,
      type: "monthly",
      initial_amount: String(plan.creditsCount),
      remaining_amount: String(plan.creditsCount),
      expires_at: new Date(data.next_billing_date),
      is_expired: false,
      reason: `Upgrade to ${plan.name} plan`,
    });
  });

  // Refreshing the user wallet cache from the redis
  await revalidateUserCreditWalletCache(null, userId);
};
