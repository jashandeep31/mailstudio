import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import DodoPayments from "dodopayments";
import { db, eq, plansTable, usersTable } from "@repo/db";
import { env } from "../../lib/env.js";
import { v4 as uuid } from "uuid";
import { handlePaymentSuccessWebhook } from "./functions/payment-success.js";
import { handleSubscriptionActiveWebhook } from "./functions/subscription-active.js";

export const dodoPaymentClient = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: env.DODO_PAYMENTS_ENVIRONMENT,
  webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
});

export const getProSubscriptonUrl = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);

    // Checking th type which is passed in the query
    const type = req.body.type as "pro" | "pro_plus";
    if (!type) throw new AppError("Invalid plan type", 400);
    if (type !== "pro" && type !== "pro_plus")
      throw new AppError("Invalid plan type", 400);

    const orderId = uuid();
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));
    if (!user) throw new AppError("User not found", 404);
    const paymentSession = await dodoPaymentClient.checkoutSessions.create({
      product_cart: [
        {
          product_id:
            type === "pro" ? env.DODO_PRODUCT_PRO : env.DODO_PRODUCT_PRO_PLUS,
          quantity: 1,
        },
      ],
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
        plan: type,
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
    // const event = dodoPaymentClient.webhooks.unwrap(req.body.toString(), {
    //   headers: {
    //     "webhook-id": req.headers["webhook-id"] as string,
    //     "webhook-signature": req.headers["webhook-signature"] as string,
    //     "webhook-timestamp": req.headers["webhook-timestamp"] as string,
    //   },
    // });
    const event = req.body;

    switch (event.type) {
      // TODO: Remove the payment success web hook
      // case "payment.succeeded":
      //   if (env.ENVOIRONMENT === "production") {
      //     await handlePaymentSuccessWebhook({
      //       event,
      //       res,
      //     });
      //   }
      //   break;

      case "subscription.active":
        console.log(`we are in the active subs case`);
        await handleSubscriptionActiveWebhook({
          event,
          res,
        });
        break;
      default:
        break;
    }
    res.status(200).json({ received: true });
    return;
  },
);
// case "subscription.cancelled":
//   await handleSubscriptionCancelledWebhook({
//     event,
//     res,
//   });
//   break;
// case "subscription.renewed":
//   await handleSubscriptionRenewedWebhook({
//     event,
//     res,
//   });
//   break;
// case "subscription.on_hold":
//   await handleSubscriptionOnHoldWebhook({
//     event,
//     res,
//   });
//   break;
// case "subscription.expired":
//   await handleSubscriptionExpiredWebhook({
//     event,
//     res,
//   });
//   break;
// case "subscription.failed":
//   await handleSubscriptionFailedWebhook({
//     event,
//     res,
//   });
//   break;
// case "subscription.plan_changed":
//   await handleSubscriptionPlanChangedWebhook({
//     event,
//     res,
//   });
//   break;
// case "subscription.updated":
//   await handleSubscriptionUpdatedWebhook({
//     event,
//     res,
//   });
//   break;
