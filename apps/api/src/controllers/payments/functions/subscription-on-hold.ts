import { Response } from "express";
import DodoPayments from "dodopayments";
import { dodoPaymentClient } from "../dodo-payments.js";

export const handleSubscriptionOnHoldWebhook = async ({
  event,
  res,
}: {
  event: DodoPayments.Webhooks.SubscriptionOnHoldWebhookEvent;
  res: Response;
}) => {
  // TODO: Implement subscription on hold logic
};
