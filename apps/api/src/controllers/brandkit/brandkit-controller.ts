import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { and, brandKitsTable, db, eq } from "@repo/db";
import z from "zod";

export const getUserBrandKits = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);
    const brandkits = await db
      .select()
      .from(brandKitsTable)
      .where(eq(brandKitsTable.user_id, req.user.id));
    res.status(200).json({
      data: brandkits,
    });
  },
);

const deleteBrandKitSchema = z.object({
  id: z.string(),
});
export const deleteBrandKit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);
    const parsedData = deleteBrandKitSchema.parse(req.params);
    await db
      .delete(brandKitsTable)
      .where(
        and(
          eq(brandKitsTable.user_id, req.user.id),
          eq(brandKitsTable.id, parsedData.id),
        ),
      );
    res.status(200).json({
      message: "Deleted the brandkit",
    });
  },
);

export const createBrandKit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);
    //TODO: make the request to the micro service
    res.status(201).json({
      data: {},
    });
  },
);
