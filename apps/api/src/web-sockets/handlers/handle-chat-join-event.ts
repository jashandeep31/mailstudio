import {
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  desc,
  eq,
} from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import WebSocket from "ws";
import z from "zod";
import { streamAndHandleQuestion } from "../functions/stream-and-handle-question.js";

export const handleChatJoinEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:joined-chat"]>,
  socket: WebSocket,
) => {
  const versions = await db
    .select()
    .from(chatVersionsTable)
    .where(eq(chatVersionsTable.chat_id, data.chatId))
    .leftJoin(
      chatVersionPromptsTable,
      eq(chatVersionPromptsTable.version_id, chatVersionsTable.id),
    )
    .leftJoin(
      chatVersionOutputsTable,
      eq(chatVersionOutputsTable.version_id, chatVersionsTable.id),
    )
    .orderBy(desc(chatVersionsTable.created_at))
    .limit(3);

  // sending the chat data  to the user
  socket.send(
    JSON.stringify({
      key: "res:chat-data",
      data: {
        versions: versions.reverse(),
      },
    }),
  );

  return versions;
};
