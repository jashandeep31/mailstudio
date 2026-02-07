import { db, brandKitsTable, eq, uploadMediaTable, inArray } from "@repo/db";
import { createBrandkitSchema } from "@repo/shared";
import { Request, Response } from "express";
import { AppError } from "../../lib/app-error.js";
import { catchAsync } from "../../lib/catch-async.js";
import { getPlanInfoByType } from "../../lib/get-plan-info.js";

export const createManualBrandkit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authenctication is required", 400);
    const userId = req.user.id;

    if (req.user.planType === "free")
      throw new AppError("Pro or Pro plus version is required", 400);

    // Checking the the total user brandkits
    const planInfo = getPlanInfoByType(req.user.planType);
    const userBrandKits = await db
      .select()
      .from(brandKitsTable)
      .where(eq(brandKitsTable.user_id, req.user.id));
    if (userBrandKits.length >= planInfo.brandkitsAllowed)
      throw new AppError("You have reached the brandkits limit", 400);

    const parsedData = createBrandkitSchema.parse(req.body);

    const urlsData: Record<string, string> = {};
    // handling the upload images
    if (parsedData.logoId) {
      const [logoData] = await db
        .select()
        .from(uploadMediaTable)
        .where(eq(uploadMediaTable.id, parsedData.logoId));
      if (!logoData) return;
      urlsData["logo_url"] = logoData.exact_url;
    }
    if (parsedData.iconLogoId) {
      const [iconLogoData] = await db
        .select()
        .from(uploadMediaTable)
        .where(eq(uploadMediaTable.id, parsedData.iconLogoId));
      if (!iconLogoData) return;
      urlsData["icon_logo_url"] = iconLogoData.exact_url;
    }

    // TODO: make it the transaction and remove from the deleting hte images
    const brandKit = await db.transaction(async (tx) => {
      const [brandKit] = await tx
        .insert(brandKitsTable)
        .values({
          user_id: userId,
          ...parsedData,
          logo_url: urlsData.logo_url,
          icon_logo_url: urlsData.icon_logo_url,
        })
        .returning();
      // Making the uplaod to used so we don't delte it
      if (!brandKit) throw new AppError("Failed to create brandkit ", 500);
      const mediaIds: string[] = [
        parsedData.logoId,
        parsedData.iconLogoId,
      ].filter((v): v is string => typeof v === "string");
      if (mediaIds.length > 0) {
        await tx
          .update(uploadMediaTable)
          .set({ used: true })
          .where(inArray(uploadMediaTable.id, mediaIds));
      }
      return brandKit;
    });
    res.status(201).json({
      status: "success",
      data: {
        id: brandKit.id,
      },
    });
    return;
  },
);
