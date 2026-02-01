import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { and, brandKitsTable, db, eq } from "@repo/db";
import { z } from "zod";
import { r2RemoveObject } from "../../lib/configs/r2-config.js";

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

const getBrandKitByIdSchema = z.object({
  id: z.string(),
});
export const getUserBrandKitById = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);
    const parsedData = getBrandKitByIdSchema.parse(req.params);
    const [brandkit] = await db
      .select()
      .from(brandKitsTable)
      .where(
        and(
          eq(brandKitsTable.user_id, req.user.id),
          eq(brandKitsTable.id, parsedData.id),
        ),
      );
    res.status(200).json({
      data: brandkit,
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
    const [brandkit] = await db
      .delete(brandKitsTable)
      .where(
        and(
          eq(brandKitsTable.user_id, req.user.id),
          eq(brandKitsTable.id, parsedData.id),
        ),
      )
      .returning();

    // Freeing up the space
    if (
      brandkit &&
      brandkit.logo_url &&
      brandkit.icon_logo_url !== "https://public.mailstudio.dev/mailstudio.png"
    )
      await r2RemoveObject(brandkit.logo_url);

    // we are preventing the delete of the default brandkit
    if (
      brandkit &&
      brandkit.icon_logo_url &&
      brandkit.icon_logo_url !== "https://public.mailstudio.dev/mailstudio.png"
    )
      await r2RemoveObject(brandkit.icon_logo_url);

    res.status(200).json({
      message: "Deleted the brandkit",
    });
  },
);
