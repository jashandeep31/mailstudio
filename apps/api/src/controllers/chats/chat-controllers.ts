import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { chatsTable, db, desc, eq } from "@repo/db";

export const getAllUserChats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication failed", 400);
    const chats = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.user_id, req.user.id))
      .orderBy(desc(chatsTable.created_at))
      .limit(10);
    res.status(200).json({
      data: chats,
    });
    return;
  },
);
