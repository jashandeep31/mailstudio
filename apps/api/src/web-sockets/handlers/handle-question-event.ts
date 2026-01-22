import {
  and,
  chatMediaTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  eq,
  inArray,
  uploadMediaTable,
} from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import { z } from "zod";
import { WebSocket } from "ws";
import { streamAndHandleQuestion } from "../functions/stream-and-handle-question.js";

export const handleQuestionEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:first-chat-message"]>,
  socket: WebSocket,
) => {
  const { chatVersion, chatQuestion, chatMedia } = await db.transaction(
    async (tx) => {
      const validMedia = await validateMediaIds(data.media, socket.userId);
      const [chatVersion] = await tx
        .insert(chatVersionsTable)
        .values({
          chat_id: data.chatId,
          version_number: 1,
          user_id: socket.userId,
        })
        .returning();

      if (!chatVersion) throw new Error("Failed to create the chat");
      const [chatQuestion] = await tx
        .insert(chatVersionPromptsTable)
        .values({
          version_id: chatVersion.id,
          prompt: data.message,
          brand_kit_id: data.brandKitId,
        })
        .returning();
      if (!chatQuestion) throw new Error("Something went wrong");
      let chatMedia: (typeof chatMediaTable.$inferSelect)[] = [];
      if (validMedia.length > 0) {
        chatMedia = await tx
          .insert(chatMediaTable)
          .values(
            validMedia.map((media) => ({
              name: media.key,
              storage_path: media.exact_url,
              user_id: socket.userId,
              chat_prompt_id: chatQuestion.id,
            })),
          )
          .returning();
      }
      return {
        chatVersion,
        chatQuestion,
        chatMedia,
      };
    },
  );
  if (!chatQuestion) throw new Error("Something went wrong");

  await streamAndHandleQuestion({
    chatQuestion: chatQuestion,
    chatMedia: chatMedia,
    chatId: data.chatId,
    chatVersion: chatVersion,
    socket,
  });
};

export const validateMediaIds = async (
  mediaIds: string[],
  userId: string,
): Promise<(typeof uploadMediaTable.$inferSelect)[]> => {
  if (mediaIds.length === 0) return [];

  const validMedia = await db
    .select()
    .from(uploadMediaTable)
    .where(
      and(
        inArray(uploadMediaTable.id, mediaIds),
        eq(uploadMediaTable.user_id, userId),
      ),
    );

  if (validMedia.length !== mediaIds.length) {
    throw new Error("Invalid media id");
  }

  return validMedia;
};
