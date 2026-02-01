import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { creditsGrantsTable, db, eq, plansTable } from "@repo/db";

export const getUserPlan = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 400);
  const [plan] = await db
    .select()
    .from(plansTable)
    .where(eq(plansTable.user_id, req.user.id));
  res.status(200).json({
    data: { ...plan },
  });
  return;
});

export const getUserCreditGrandsHistory = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication required", 400);
    const creditsHistory = await db
      .select()
      .from(creditsGrantsTable)
      .where(eq(creditsGrantsTable.user_id, req.user.id));
    res.status(200).json({
      data: creditsHistory,
    });
  },
);
