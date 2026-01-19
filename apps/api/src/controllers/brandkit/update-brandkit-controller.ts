import { createBrandkitSchema } from "@repo/shared";
import { AppError } from "../../lib/app-error.js";
import { catchAsync } from "../../lib/catch-async.js";
import { Request, Response } from "express";
import z from "zod";

const updateBrandkitSchema = createBrandkitSchema.extend({ id: z.string() });

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
