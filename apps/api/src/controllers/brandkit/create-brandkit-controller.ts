import { AppError } from "../../lib/app-error.js";
import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { z } from "zod";
import axios from "axios";
import { env } from "../../lib/env.js";
import { brandKitsTable, db, eq } from "@repo/db";
import { getPlanInfoByType } from "../../lib/get-plan-info.js";

const createBrandkitColorsSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
});

const createBrandkitSchema = z.object({
  colors: createBrandkitColorsSchema,
  brandSummary: z.string().optional(),
  websiteUrl: z.string(),
  name: z.string(),
  brandDesignSyle: z.string().optional(),
});

const createBrandKitInputSchema = z.object({
  websiteUrl: z.string(),
});

export const createBrandKit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);

    if (req.user.planType === "free")
      throw new AppError("Pro or Pro plus version is required", 400);

    const planInfo = getPlanInfoByType(req.user.planType);
    const { websiteUrl } = createBrandKitInputSchema.parse(req.body);

    // Checking the the total user brandkits
    const userBrandKits = await db
      .select()
      .from(brandKitsTable)
      .where(eq(brandKitsTable.user_id, req.user.id));
    if (userBrandKits.length >= planInfo.brandkitsAllowed - 5)
      throw new AppError("You have reached the brandkits limit", 400);

    // getting the user brandkit
    const response = await axios.post(
      `${env.SCREENSHOT_SERVICE_URL}/brandkit`,
      { url: websiteUrl, secret: env.INTERNAL_API_KEY },
    );

    const parsedData = createBrandkitSchema.parse({
      ...JSON.parse(response.data.data),
      websiteUrl: websiteUrl,
    });

    //creating the brandkit
    const [brandKit] = await db
      .insert(brandKitsTable)
      .values({
        user_id: req.user.id,
        name: parsedData.name,
        brand_summary: parsedData.brandSummary,
        brand_design_style: parsedData.brandDesignSyle,
        website_url: parsedData.websiteUrl,
        primary_color: parsedData.colors.primaryColor,
        secondary_color: parsedData.colors.secondaryColor,
        updated_at: new Date(),
        created_at: new Date(),
      })
      .returning();

    res.status(201).json({
      data: brandKit,
    });
  },
);
