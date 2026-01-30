import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../lib/catch-async.js";
import { AppError } from "../../lib/app-error.js";
import { and, chatsTable, db, desc, eq } from "@repo/db";
import { z } from "zod";
import { r2RemoveObject } from "../../lib/configs/r2-config.js";

export const getAllUserChats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication failed", 400);
    const chats = await db
      .select()
      .from(chatsTable)
      .where(eq(chatsTable.user_id, req.user.id))
      .orderBy(desc(chatsTable.updated_at))
      .limit(10);
    res.status(200).json({
      data: chats,
    });
    return;
  },
);

const getChatSchema = z.object({
  chatId: z.string(),
});

export const getChatById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication failed", 400);
    const parsedData = getChatSchema.parse(req.params);
    const chats = await db
      .select()
      .from(chatsTable)
      .where(
        and(
          eq(chatsTable.id, parsedData.chatId),
          eq(chatsTable.user_id, req.user.id),
        ),
      )
      .limit(1);

    if (!chats.length) {
      throw new AppError("Chat not found", 404);
    }

    res.status(200).json({
      data: chats[0],
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
    const [chat] = await db
      .delete(chatsTable)
      .where(
        and(
          eq(chatsTable.id, parsedData.chatId),
          eq(chatsTable.user_id, req.user.id),
        ),
      )
      .returning();

    // Freeing up the space from the 2
    if (chat && chat.thumbnail) await r2RemoveObject(chat.thumbnail);

    res.status(200).json({
      message: "Chat is deleted",
    });
    return;
  },
);

const updateChatSchema = z.object({
  chatId: z.string(),
  name: z.string().optional(),
  public: z.boolean().optional(),
  price: z.string().optional(),
});

export const updateChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError("Authentication failed", 400);
    const parsedData = updateChatSchema.parse(req.body);

    // Build update data object more efficiently
    const updateData = Object.fromEntries(
      Object.entries({
        name: parsedData.name,
        public: parsedData.public,
        price: parsedData.price,
      }).filter(([_, value]) => value !== undefined),
    ) as Partial<typeof chatsTable.$inferInsert>;

    if (Object.keys(updateData).length === 0) {
      res.status(200).json({
        message: "No changes to update",
      });
      return;
    }

    if (Number(updateData.price) >= 20) {
      throw new AppError("Price cannot be more than 20", 400);
    }

    await db
      .update(chatsTable)
      .set({
        ...updateData,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(chatsTable.id, parsedData.chatId),
          eq(chatsTable.user_id, req.user.id),
        ),
      );

    res.status(200).json({
      message: "Chat updated successfully",
      data: updateData,
    });
    return;
  },
);
