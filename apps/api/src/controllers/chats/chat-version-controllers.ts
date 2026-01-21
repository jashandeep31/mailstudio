import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { and, chatVersionsTable, db, eq } from "@repo/db";

export const deleteChatVersion = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Authentication is required", 400);
    if (!req.params.versionId)
      throw new AppError("Version id is required", 400);
    await db
      .delete(chatVersionsTable)
      .where(
        and(
          eq(chatVersionsTable.id, req.params.versionId),
          eq(chatVersionsTable.user_id, req.user.id),
        ),
      );
    res.status(200).json({ message: "Chat version deleted successfully" });
  },
);
