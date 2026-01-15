import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import {
  billingsTable,
  db,
  desc,
  eq,
  paymentTransactionsTable,
} from "@repo/db";

export const getUserBillings = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication required", 400);

    const billings = await db
      .select({
        id: billingsTable.id,
        plan_type: billingsTable.plan_type,
        amount: billingsTable.amount,
        created_at: billingsTable.created_at,
        payment: {
          settlement_amount: paymentTransactionsTable.settlement_amount,
          tax_amount: paymentTransactionsTable.tax_amount,
          status: paymentTransactionsTable.status,
          payment_method: paymentTransactionsTable.payment_method,
        },
      })
      .from(billingsTable)
      .leftJoin(
        paymentTransactionsTable,
        eq(paymentTransactionsTable.id, billingsTable.payment_transaction_id),
      )
      .where(eq(billingsTable.user_id, req.user.id))
      .orderBy(desc(billingsTable.created_at));

    res.status(200).json({
      data: billings,
    });
  },
);
