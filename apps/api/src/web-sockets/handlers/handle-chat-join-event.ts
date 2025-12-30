import {
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  desc,
  eq,
} from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import z from "zod";

export const handleChatJoinEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:joined-chat"]>,
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
    .orderBy(desc(chatVersionsTable.version_number))
    .limit(3);
  return versions;
};
