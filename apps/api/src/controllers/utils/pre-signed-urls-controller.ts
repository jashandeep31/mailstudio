import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import z, { object } from "zod";
import { r2GetSignedUrl } from "../../lib/configs/r2-config.js";
import { v4 as uuidv4 } from "uuid";
import { uploadRegistry } from "../../lib/configs/upload-registery.js";
import { db, uploadMediaTable } from "@repo/db";
import { getPreSignedUrlSchema } from "@repo/shared";
import { env } from "../../lib/env.js";

export const getPreSignedUrl = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication required", 401);
    const { key, contentType, fileName, size } = getPreSignedUrlSchema.parse(
      req.body,
    );
    const uploadConfig = uploadRegistry[key];
    if (size > uploadConfig.maxFileSize) {
      throw new AppError("File size exceeds limit", 400);
    }
    if (
      !uploadConfig.allowedMimeTypes.includes(
        contentType as (typeof uploadConfig.allowedMimeTypes)[number],
      )
    ) {
      throw new AppError("Invalid file type", 400);
    }
    let mediaAccessPath: string;
    switch (key) {
      case "attachment":
        mediaAccessPath = uploadConfig.getPathKey(fileName);
        break;
      default:
        throw new AppError("Invalid upload key", 400);
    }
    const preSignedUrl = await r2GetSignedUrl({
      uniqueKey: mediaAccessPath,
      contentType,
    });
    const exactUrl = `${env.CLOUDFLARE_R2_PUBLIC_DOMAIN}/${mediaAccessPath}`;
    const [media] = await db
      .insert(uploadMediaTable)
      .values({
        key: key,
        used: false,
        deleted: false,
        exact_url: exactUrl,
        signed_url: preSignedUrl,
        user_id: req.user.id,
      })
      .returning();

    if (!media) throw new AppError("Something went wrong ", 500);
    res.status(200).json({
      data: {
        key: media.id,
        url: preSignedUrl,
      },
    });
    return;
  },
);
