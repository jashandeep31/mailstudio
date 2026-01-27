import { Response } from "express";
import DodoPayments from "dodopayments";
import { dodoPaymentClient } from "../dodo-payments.js";
export const handleSubscriptionCancelledWebhook = async ({
  event,
  res,
}: {
  event: DodoPayments.Webhooks.SubscriptionCancelledWebhookEvent;
  res: Response;
}) => {
  const subscription = await dodoPaymentClient.subscriptions.retrieve(
    event.data.subscription_id,
  );
};
