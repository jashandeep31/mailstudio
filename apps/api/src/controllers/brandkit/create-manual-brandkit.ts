import { raw, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { createBrandkitSchema } from "@repo/shared";
import { brandKitsTable, db, eq, inArray, uploadMediaTable } from "@repo/db";

export const createManualBrandkit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authenctication is required", 400);
    const userId = req.user.id;

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
    await db.transaction(async (tx) => {
      await tx.insert(brandKitsTable).values({
        user_id: userId,
        ...parsedData,
        logo_url: urlsData.logo_url,
        icon_logo_url: urlsData.icon_logo_url,
      });
      // Making the uplaod to used so we don't delte it
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
    res.status(201).json({
      status: "success",
      message: "Brand Kit is created",
    });
    return;
  },
);
