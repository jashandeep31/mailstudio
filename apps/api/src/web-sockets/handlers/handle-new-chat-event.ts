import { z } from "zod";
import { SocketEventSchemas } from "@repo/shared";
import { chatsTable, db } from "@repo/db";
import WebSocket from "ws";
import { redis } from "../../lib/db.js";
import { AppError } from "../../lib/app-error.js";
export const handleNewChatEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:new-chat"]>,
  socket: WebSocket,
) => {
  const userId = socket.userId;
  const [chat] = await db
    .insert(chatsTable)
    .values({
      user_id: userId,
      name: "Chat",
      public: false,
    })
    .returning();

  if (!chat) throw new AppError("Failed to create chat", 500);
  socket.send(
    JSON.stringify({
      key: "res:new-chat",
      data: {
        redirectUrl: `/chat/${chat.id}`,
      },
    }),
  );

  redis.set(chat.id, socket.userId);
  return chat;
};
