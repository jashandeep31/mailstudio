import { AppError } from "../../lib/app-error.js";
import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import z from "zod";
import axios from "axios";
import { env } from "../../lib/env.js";
import { brandKitsTable, db } from "@repo/db";

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

export const createBrandKit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);
    const response = await axios.post(
      `${env.SCREENSHOT_SERVICE_URL}/get-brandkit`,
      { url: "https://jashan.dev" },
    );
    console.log(response.data);
    const parsedData = createBrandkitSchema.parse({
      ...response.data.data,
      websiteUrl: `hhtps://jashan.dev`,
    });
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
