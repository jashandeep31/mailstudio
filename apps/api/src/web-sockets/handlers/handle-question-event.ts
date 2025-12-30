import { chatVersionPromptsTable, chatVersionsTable, db } from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import z from "zod";

export const handleQuestionEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:chat-message"]>,
) => {
  await db.transaction(async (tx) => {
    const [chatVersion] = await db
      .insert(chatVersionsTable)
      .values({
        chat_id: data.chatId,
        version_number: 1,
      })
      .returning();

    if (!chatVersion) throw new Error("Failed to create the chat");
    await db.insert(chatVersionPromptsTable).values({
      version_id: chatVersion.id,
      prompt: "hwo to makeit ",
    });

    return chatVersion;
  });
};
