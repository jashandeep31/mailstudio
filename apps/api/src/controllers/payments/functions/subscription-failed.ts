import { Response } from "express";
import DodoPayments from "dodopayments";
import { dodoPaymentClient } from "../dodo-payments.js";

export const handleSubscriptionFailedWebhook = async ({
  event,
  res,
}: {
  event: DodoPayments.Webhooks.SubscriptionFailedWebhookEvent;
  res: Response;
}) => {
  // TODO: Implement subscription failure logic
};
