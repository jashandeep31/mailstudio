import {
  and,
  chatMediaTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  eq,
  uploadMediaTable,
} from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import z from "zod";
import { WebSocket } from "ws";
import { streamAndHandleQuestion } from "../functions/stream-and-handle-question.js";
const extendedZodSchema = SocketEventSchemas["event:first-chat-message"].extend(
  {
    type: z.enum(["old", "new"]),
  },
);
export const handleQuestionEvent = async (
  data: z.infer<typeof extendedZodSchema>,
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

  streamAndHandleQuestion({
    chatQuestion: chatQuestion,
    chatMedia: chatMedia,
    chatId: data.chatId,
    chatVersion: chatVersion,
    socket,
    type: data.type,
  });
};

const validateMediaIds = async (
  mediaIds: string[],
  userId: string,
): Promise<(typeof uploadMediaTable.$inferSelect)[]> => {
  const valids = [];
  for (const mediaId of mediaIds) {
    const [media] = await db
      .select()
      .from(uploadMediaTable)
      .where(
        and(
          eq(uploadMediaTable.id, mediaId),
          eq(uploadMediaTable.user_id, userId),
        ),
      );

    if (!media) throw new Error("Invalid media id");
    valids.push(media);
  }
  return valids;
};
