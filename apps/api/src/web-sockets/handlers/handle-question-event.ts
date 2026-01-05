import { chatVersionPromptsTable, chatVersionsTable, db } from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import z from "zod";
import { WebSocket } from "ws";
import { streamAndHandleQuestion } from "../functions/stream-and-handle-question.js";
const extendedZodSchema = SocketEventSchemas["event:chat-message"].extend({
  type: z.enum(["old", "new"]),
});
export const handleQuestionEvent = async (
  data: z.infer<typeof extendedZodSchema>,
  socket: WebSocket,
) => {
  const { chatVersion, chatQuestion } = await db.transaction(async (tx) => {
    const [chatVersion] = await db
      .insert(chatVersionsTable)
      .values({
        chat_id: data.chatId,
        version_number: 1,
      })
      .returning();

    if (!chatVersion) throw new Error("Failed to create the chat");
    const [chatQuestion] = await db
      .insert(chatVersionPromptsTable)
      .values({
        version_id: chatVersion.id,
        prompt: data.message,
      })
      .returning();
    return {
      chatVersion,
      chatQuestion,
    };
  });
  if (!chatQuestion) throw new Error("Something went wrong");

  if (data.type === "old") {
    socket.send(
      JSON.stringify({
        key: "res:new-version",
        data: {
          chat_versions: chatVersion,
          chat_version_prompts: chatQuestion,
          chat_version_outputs: undefined,
        },
      }),
    );
  }

  streamAndHandleQuestion({
    chatQuestion: chatQuestion,
    chatId: data.chatId,
    chatVersion: chatVersion,
    socket,
    type: data.type,
  });
};
