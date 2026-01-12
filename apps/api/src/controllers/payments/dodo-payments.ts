import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import DodoPayments from "dodopayments";
import { db, eq, usersTable } from "@repo/db";
import { env } from "../../lib/env.js";

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: "test_mode", // defaults to 'live_mode'
});

export const getProSubscriptonUrl = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id));
    if (!user) throw new AppError("User not found", 404);
    const paymentSession = await client.checkoutSessions.create({
      product_cart: [{ product_id: "pdt_0NW3JXP572Os6xSYT6Hio", quantity: 1 }],
      subscription_data: {},
      customer: {
        email: req.user.email,
        name: (user.firstName + " " + user.lastName).trim(),
      },
      return_url: `${env.BACKEND_URL}/api/v1/payments/d/${user.id}`,
    });
    res.status(200).json({
      data: {
        url: paymentSession.checkout_url,
      },
    });
    return;
  },
);

export const handleDodoPaymentWebhook = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.body);
    return;
  },
);
