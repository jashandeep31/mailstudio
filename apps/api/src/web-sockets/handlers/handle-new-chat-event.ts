import { z } from "zod";
import { SocketEventSchemas, SocketEventKeySchema } from "@repo/shared";
import { chatsTable, db } from "@repo/db";
export const handleNewChatEvent = async (
  data: z.infer<(typeof SocketEventSchemas)["event:new-chat"]>,
) => {
  const { message, media, brandKitId } = data;

  const [chat] = await db
    .insert(chatsTable)
    .values({
      user_id: "0212f23a-b06a-458a-9873-dad5b4f996b0",
      name: "hals;df",
      public: false,
    })
    .returning();

  if (!chat) throw new Error("Something went wrong");
  return chat;
};
