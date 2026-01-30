import {
  and,
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  eq,
  gt,
  desc,
} from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import { WebSocket } from "ws";
import { z } from "zod";

interface ChatRollbackEventHandler {
  data: z.infer<(typeof SocketEventSchemas)["event:chat-rollback"]>;
  socket: WebSocket;
}

export const chatRollbackEventHandler = async ({
  data,
  socket,
}: ChatRollbackEventHandler) => {
  // things we had already done
  // 1. check the chat auth
  // 2. Check nothing is streaming for now

  // Deleting all the latest version to rollback version
  await db
    .delete(chatVersionsTable)
    .where(
      and(
        eq(chatVersionsTable.chat_id, data.chatId),
        gt(
          chatVersionsTable.created_at,
          db
            .select({ created_at: chatVersionsTable.created_at })
            .from(chatVersionsTable)
            .where(eq(chatVersionsTable.id, data.versionId)),
        ),
      ),
    );

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
    .orderBy(desc(chatVersionsTable.created_at));

  socket.send(
    JSON.stringify({
      key: "res:rollback",
      data: {
        versions: [...versions.reverse()],
      },
    }),
  );
};
