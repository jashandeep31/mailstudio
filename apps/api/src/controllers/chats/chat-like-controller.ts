import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { z } from "zod";
import { and, db, eq, userLikedChatsTable } from "@repo/db";
import { AppError } from "../../lib/app-error.js";

const likeChatSchema = z.object({
  chatId: z.string(),
  action: z.enum(["like", "unlike"]),
});
export const likeChat = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication is required", 400);

  const data = likeChatSchema.parse(req.body);
  if (data.action === "like") {
    await db
      .insert(userLikedChatsTable)
      .values({
        chat_id: data.chatId,
        user_id: req.user.id,
      })
      .onConflictDoNothing();
  } else {
    await db
      .delete(userLikedChatsTable)
      .where(
        and(
          eq(userLikedChatsTable.chat_id, data.chatId),
          eq(userLikedChatsTable.user_id, req.user.id),
        ),
      );
  }
  res.status(201).json({
    message: data.action === "like" ? "chat is liked" : "chat is unliked",
    status: "okay",
  });
});
