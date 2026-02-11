import {
  and,
  asc,
  chatsTable,
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  eq,
} from "@repo/db";
import { AppError } from "../../lib/app-error.js";
import { catchAsync } from "../../lib/catch-async.js";
import { Request, Response } from "express";
import { z } from "zod";

const cloneChatSchema = z.object({
  chatId: z.string(),
});

export const cloneChat = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { chatId } = cloneChatSchema.parse(req.body);
  if (!userId) throw new AppError("Authentication is requried", 400);

  const clonedChat = await db.transaction(async (tx) => {
    const [chat] = await tx
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.user_id, userId), eq(chatsTable.id, chatId)));

    if (!chat) throw new AppError("Chat not found", 404);

    const versions = await tx
      .select()
      .from(chatVersionsTable)
      .leftJoin(
        chatVersionOutputsTable,
        eq(chatVersionOutputsTable.version_id, chatVersionsTable.id),
      )
      .leftJoin(
        chatVersionPromptsTable,
        eq(chatVersionPromptsTable.version_id, chatVersionsTable.id),
      )
      .where(eq(chatVersionsTable.chat_id, chatId))
      .orderBy(asc(chatVersionsTable.created_at));

    const [newChat] = await tx
      .insert(chatsTable)
      .values({
        user_id: userId,
        name: chat.name + " copy",
        thumbnail: chat.thumbnail,
        public: chat.public,
        price: chat.price,
        category_id: chat.category_id,
      })
      .returning();

    if (!newChat) throw new AppError("Failed to clone chat", 500);

    for (const {
      chat_versions,
      chat_version_outputs,
      chat_version_prompts,
    } of versions) {
      const [newVersion] = await tx
        .insert(chatVersionsTable)
        .values({
          chat_id: newChat.id,
          user_id: userId,
          version_number: chat_versions.version_number,
        })
        .returning();

      if (!newVersion) throw new AppError("Failed to clone chat version", 500);

      if (chat_version_prompts) {
        await tx.insert(chatVersionPromptsTable).values({
          version_id: newVersion.id,
          prompt: chat_version_prompts.prompt,
          brand_kit_id: chat_version_prompts.brand_kit_id,
        });
      }

      if (chat_version_outputs) {
        await tx.insert(chatVersionOutputsTable).values({
          version_id: newVersion.id,
          overview: chat_version_outputs.overview,
          mjml_code: chat_version_outputs.mjml_code,
          html_code: chat_version_outputs.html_code,
          generation_instructions: chat_version_outputs.generation_instructions,
        });
      }
    }

    return newChat;
  });

  res.status(201).json({
    message: "Chat is copied successfully",
    data: {
      id: clonedChat.id,
    },
  });
});
