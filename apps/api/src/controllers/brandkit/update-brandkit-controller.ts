import { createBrandkitSchema } from "@repo/shared";
import { AppError } from "../../lib/app-error.js";
import { catchAsync } from "../../lib/catch-async.js";
import { Request, Response } from "express";
import { z } from "zod";
import {
  db,
  uploadMediaTable,
  eq,
  brandKitsTable,
  and,
  inArray,
} from "@repo/db";
import { delCachedBrandKit } from "../../lib/redis/brand-kit-cache.ts.js";

const updateBrandkitSchema = createBrandkitSchema.extend({ id: z.string() });

export const updateBrandKit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);
    const userId = req.user.id;
    const parsedData = updateBrandkitSchema.parse(req.body);
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

    await db.transaction(async (tx) => {
      await tx
        .update(brandKitsTable)
        .set({
          ...parsedData,
          logo_url: urlsData.logo_url,
          icon_logo_url: urlsData.icon_logo_url,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(brandKitsTable.id, parsedData.id),
            eq(brandKitsTable.user_id, userId),
          ),
        );
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
    });

    await delCachedBrandKit(parsedData.id, userId);

    res.status(200).json({
      status: "success",
      data: {
        id: parsedData.id,
      },
    });
    return;
  },
);
