import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import DodoPayments from "dodopayments";
import { db, eq, plansTable, usersTable } from "@repo/db";
import { env } from "../../lib/env.js";
import { v4 as uuid } from "uuid";

// Dodopayments client to access the different things of the dodopayments instead of using the http
export const dodoPaymentClient = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY,
  environment: env.DODO_PAYMENTS_ENVIRONMENT,
  webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
});

// Controller to create the paying url
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
        email: (() => {
          // To make the unique session as easy to debug the things in the development env
          if (
            env.ENVIRONMENT == "development" &&
            env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
          ) {
            return (
              req.user.email.split("@")[0]! +
              Math.floor(Math.random() * 1000) +
              "@" +
              req.user.email.split("@")[1]!
            );
          }
          return req.user.email;
        })(),

        name: (user.first_name + " " + user.last_name).trim(),
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

// Createing the custom customer session to manage his things
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
