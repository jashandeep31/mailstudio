import { z } from "zod";
import { SocketEventSchemas } from "@repo/shared";
import { chatsTable, db } from "@repo/db";
import WebSocket from "ws";
export const handleNewChatEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:new-chat"]>,
  socket: WebSocket,
) => {
  const userId = socket.userId;
  const { message, media, brandKitId } = data;
  const [chat] = await db
    .insert(chatsTable)
    .values({
      user_id: userId,
      name: message.slice(0, 10),
      public: false,
    })
    .returning();

  if (!chat) throw new Error("Something went wrong");
  socket.send(
    JSON.stringify({
      key: "res:new-chat",
      data: {
        redirectUrl: `/chat/${chat.id}`,
      },
    }),
  );
  return chat;
};
