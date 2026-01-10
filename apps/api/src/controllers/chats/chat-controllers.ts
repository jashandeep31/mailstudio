import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { and, chatsTable, db, desc, eq } from "@repo/db";
import z from "zod";

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

const deleteChatSchema = z.object({
  chatId: z.string(),
});
export const deleteUserChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication failed", 400);
    const parsedData = deleteChatSchema.parse(req.params);
    await db
      .delete(chatsTable)
      .where(
        and(
          eq(chatsTable.id, parsedData.chatId),
          eq(chatsTable.user_id, req.user.id),
        ),
      );
    res.status(200).json({
      message: "Chat is deleted",
    });
    return;
  },
);

const updateChatSchema = z.object({
  chatId: z.string(),
  name: z.string(),
});
export const updateChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication failed", 400);
    const parsedData = updateChatSchema.parse(req.body);
    await db
      .update(chatsTable)
      .set({
        name: parsedData.name,
      })
      .where(
        and(
          eq(chatsTable.id, parsedData.chatId),
          eq(chatsTable.user_id, req.user.id),
        ),
      );

    res.status(200).json({
      message: "Chat is updated",
    });
    return;
  },
);
