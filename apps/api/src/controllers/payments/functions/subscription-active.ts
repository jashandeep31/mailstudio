import { Response } from "express";
import DodoPayments from "dodopayments";
import {
  db,
  plansTable,
  eq,
  planTypeEnum,
  creditsGrantsTable,
  creditWalletsTable,
  sql,
} from "@repo/db";
import { env } from "../../../lib/env.js";
import { revalidateUserCreditWalletCache } from "../../../lib/redis/user-credit-wallet-cache.js";
import { dodoPaymentClient } from "../dodo-payments.js";

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
  res: Response;
}) => {
  const data = event.data;
  const metadata = data.metadata;

  const userId = metadata.user_id; // userid that user order
  const orderId = metadata.order_id; // random uuid
  const subscriptionId = data.subscription_id;
  const customerId = data.customer.customer_id;

  if (!userId || !orderId || !subscriptionId || !customerId) return;
  const subscription =
    await dodoPaymentClient.subscriptions.retrieve(subscriptionId);
  console.log(subscription);

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

  await db.transaction(async (tx) => {
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
      })
      .where(eq(plansTable.user_id, userId));

    // 1. Adding the credits to wallet
    // 2. Creating the credit typeof
    const [wallet] = await db
      .select()
      .from(creditWalletsTable)
      .where(eq(creditWalletsTable.user_id, userId));
    if (!wallet) return;

    // Creating the wallet new grant so that we can expire it a time
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

    //  updating the wallet balance just adding the new balance
    // Remmoval of the old credits will get done by redis
    // TODO: need to fix this soon may can  get the user wallet ot somewhere around double few mintues neeed to check this
    await tx
      .update(creditWalletsTable)
      .set({
        balance: sql`${creditWalletsTable.balance} + ${plan.creditsCount}`,
      })
      .where(eq(creditWalletsTable.id, wallet.id));
  }); // here is logic of renweing the credits of the user

  await revalidateUserCreditWalletCache(null, userId);
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
