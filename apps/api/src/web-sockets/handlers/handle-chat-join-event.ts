import {
  and,
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

export const handleChatJoinEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:joined-chat"]>,
  socket: WebSocket,
) => {
  const versions = await db
    .select()
    .from(chatVersionsTable)
    .where(
      and(
        eq(chatVersionsTable.chat_id, data.chatId),
        eq(chatVersionsTable.user_id, socket.userId),
      ),
    )
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
