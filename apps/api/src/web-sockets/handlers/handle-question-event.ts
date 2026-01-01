import { chatVersionPromptsTable, chatVersionsTable, db } from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import z from "zod";
import { WebSocket } from "ws";
import { streamAndHandleQuestion } from "../functions/stream-and-handle-question.js";

export const handleQuestionEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:chat-message"]>,
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
  streamAndHandleQuestion({
    chatQuestion: chatQuestion,
    chatId: data.chatId,
    socket,
  });
};
