import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { db, desc, eq, paymentTransactionsTable } from "@repo/db";

export const getUserPayments = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication required", 400);

    const payments = await db
      .select({
        id: paymentTransactionsTable.id,
        provider: paymentTransactionsTable.provider,
        settlement_amount: paymentTransactionsTable.settlement_amount,
        tax_amount: paymentTransactionsTable.tax_amount,
        status: paymentTransactionsTable.status,
        payment_method: paymentTransactionsTable.payment_method,
        card_last_four: paymentTransactionsTable.card_last_four,
        card_network: paymentTransactionsTable.card_network,
        created_at: paymentTransactionsTable.created_at,
      })
      .from(paymentTransactionsTable)
      .where(eq(paymentTransactionsTable.user_id, req.user.id))
      .orderBy(desc(paymentTransactionsTable.created_at));

    res.status(200).json({
      data: payments,
    });
  },
);
