import z from "zod";
import { catchAsync } from "../../lib/catch-async.js";
import { Request, Response, NextFunction } from "express";
import {
  chatVersionOutputsTable,
  chatVersionsTable,
  db,
  desc,
  eq,
} from "@repo/db";
import { AppError } from "../../lib/app-error.js";
import { env } from "../../lib/env.js";

const getChatTemplateHtmlSchema = z.object({
  chatId: z.string(),
});
export const getChatTemplateHtml = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.INTERNAL_API_KEY}`) {
      res.status(401).json({
        error: "Authentication is required",
      });
      return
    }

    const parsedData = getChatTemplateHtmlSchema.parse(req.params);
    const [lastVersion] = await db
      .select()
      .from(chatVersionsTable)
      .where(eq(chatVersionsTable.chat_id, parsedData.chatId))
      .orderBy(desc(chatVersionsTable.created_at));

    if (!lastVersion) throw new AppError("Chat version not found", 404);
    const [output] = await db
      .select()
      .from(chatVersionOutputsTable)
      .where(eq(chatVersionOutputsTable.version_id, lastVersion.id));
    // res.status(200).json({
    //   data: output?.html_code,
    // });
    // render ht mtl
    res.send(output?.html_code);
  },
);
