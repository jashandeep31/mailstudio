import { Response } from "express";
import DodoPayments from "dodopayments";
import { dodoPaymentClient } from "../dodo-payments.js";

export const handleSubscriptionPlanChangedWebhook = async ({
  event,
  res,
}: {
  event: DodoPayments.Webhooks.SubscriptionPlanChangedWebhookEvent;
  res: Response;
}) => {
  // TODO: Implement subscription plan change logic
};
