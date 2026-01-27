import { Response } from "express";
import DodoPayments from "dodopayments";
import { dodoPaymentClient } from "../dodo-payments.js";

export const handleSubscriptionExpiredWebhook = async ({
  event,
  res,
}: {
  event: DodoPayments.Webhooks.SubscriptionExpiredWebhookEvent;
  res: Response;
}) => {
  // TODO: Implement subscription expiration logic
};
