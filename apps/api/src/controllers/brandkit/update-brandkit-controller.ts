import { AppError } from "../../lib/app-error.js";
import { catchAsync } from "../../lib/catch-async.js";
import { Request, Response } from "express";
import z from "zod";

const updateBrandkitColorsSchema = z.object({
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  accent_color: z.string().optional(),
});
const updateBrandkitSchema = z.object({
  id: z.string(),
  colors: updateBrandkitColorsSchema,
  brand_summary: z.string().optional(),
  website_url: z.string(),
  name: z.string(),
  brand_design_style: z.string().optional(),

  logo_url_id: z.string().optional(),
  icon_logo_url_id: z.string().optional(),
});

export const updateBrandKit = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authorization is required", 400);
    const parsedData = updateBrandkitSchema.parse(req.body);
    res.status(200).json({
      success: true,
      data: parsedData,
    });
    return;
  },
);
