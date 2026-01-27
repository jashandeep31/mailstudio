import { Response } from "express";
import DodoPayments from "dodopayments";
import { dodoPaymentClient } from "../dodo-payments.js";

export const handleSubscriptionUpdatedWebhook = async ({
  event,
  res,
}: {
  event: DodoPayments.Webhooks.SubscriptionUpdatedWebhookEvent;
  res: Response;
}) => {
  // TODO: Implement subscription update logic
};
