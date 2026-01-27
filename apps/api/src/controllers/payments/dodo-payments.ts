import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import DodoPayments from "dodopayments";
import {
  billingsTable,
  creditTransactionsTable,
  creditWalletsTable,
  db,
  eq,
  paymentTransactionsTable,
  plansTable,
  usersTable,
} from "@repo/db";
import { env } from "../../lib/env.js";
import { v4 as uuid } from "uuid";
import { revalidateUserCreditWalletCache } from "../../lib/redis/user-credit-wallet-cache.js";
import { handlePaymentSuccessWebhook } from "./functions/payment-success.js";

export const dodoPaymentClient = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: env.DODO_PAYMENTS_ENVIRONMENT,
  webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
});

export const getProSubscriptonUrl = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const orderId = uuid();
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));
    if (!user) throw new AppError("User not found", 404);
    const paymentSession = await dodoPaymentClient.checkoutSessions.create({
      product_cart: [{ product_id: env.DODO_STARTER_PRODUCT_ID, quantity: 1 }],
      subscription_data: {},
      customer: {
        // TODO: remove this while moving to the production
        email: (() => {
          if (env.DODO_PAYMENTS_ENVIRONMENT == "test_mode") {
            return (
              req.user.email.split("@")[0]! +
              Math.floor(Math.random() * 1000) +
              "@" +
              req.user.email.split("@")[1]!
            );
          }
          return req.user.email;
        })(),

        name: (user.firstName + " " + user.lastName).trim(),
      },
      metadata: {
        user_id: user.id,
        source: "web",
        plan: "starter",
        order_id: orderId,
      },
      return_url: `${env.FRONTEND_URL}/payment-success`,
    });

    res.status(200).json({
      data: {
        url: paymentSession.checkout_url,
      },
    });

    return;
  },
);

export const dodoCustomerSession = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const [userPlan] = await db
      .select()
      .from(plansTable)
      .where(eq(plansTable.user_id, req.user.id));
    if (!userPlan || !userPlan.customer_id) {
      throw new AppError("Feature is not accesible for a time being ", 500);
    }
    const customerPortalSession =
      await dodoPaymentClient.customers.customerPortal.create(
        userPlan.customer_id,
      );
    res.status(200).json({
      data: {
        url: customerPortalSession.link,
      },
    });
    return;
  },
);

export const handleDodoPaymentWebhook = catchAsync(
  async (req: Request, res: Response) => {
    const event = dodoPaymentClient.webhooks.unwrap(req.body.toString(), {
      headers: {
        "webhook-id": req.headers["webhook-id"] as string,
        "webhook-signature": req.headers["webhook-signature"] as string,
        "webhook-timestamp": req.headers["webhook-timestamp"] as string,
      },
    });

    switch (event.type) {
      case "payment.succeeded":
        await handlePaymentSuccessWebhook({
          event,
          res,
        });
        break;
      default:
        res.status(200).json({ received: true });
    }
    return;
  },
);
