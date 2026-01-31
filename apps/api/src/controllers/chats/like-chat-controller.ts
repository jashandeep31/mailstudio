import { Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { z } from "zod";
import { and, chatsTable, db, eq, sql, userLikedChatsTable } from "@repo/db";
import { AppError } from "../../lib/app-error.js";

const likeChatSchema = z.object({
  chatId: z.string(),
  action: z.enum(["like", "unlike"]),
});
export const likeChat = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication is required", 400);

  const data = likeChatSchema.parse(req.body);
  if (data.action === "like") {
    const inserted = await db
      .insert(userLikedChatsTable)
      .values({
        chat_id: data.chatId,
        user_id: req.user.id,
      })
      .onConflictDoNothing()
      .returning({ id: userLikedChatsTable.chat_id });

    if (inserted.length > 0) {
      await db
        .update(chatsTable)
        .set({
          like_count: sql`${chatsTable.like_count} + 1`,
        })
        .where(eq(chatsTable.id, data.chatId));
    }
  } else {
    const deleted = await db
      .delete(userLikedChatsTable)
      .where(
        and(
          eq(userLikedChatsTable.chat_id, data.chatId),
          eq(userLikedChatsTable.user_id, req.user.id),
        ),
      )
      .returning({ id: userLikedChatsTable.chat_id });

    if (deleted.length > 0) {
      await db
        .update(chatsTable)
        .set({
          like_count: sql`GREATEST(${chatsTable.like_count} - 1, 0)`,
        })
        .where(eq(chatsTable.id, data.chatId));
    }
  }
  res.status(201).json({
    message: data.action === "like" ? "chat is liked" : "chat is unliked",
    status: "success",
  });
});
