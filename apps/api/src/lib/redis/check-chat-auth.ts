import { chatsTable, db, eq, and } from "@repo/db";
import { redis } from "../db.js";

interface checkChatAuth {
  userId: string;
  chatId: string;
}
type checkChatAuthResposne =
  | {
      status: "ok";
    }
  | {
      status: "error";
      error: string;
    };
export const checkChatAuth = async ({
  userId,
  chatId,
}: checkChatAuth): Promise<checkChatAuthResposne> => {
  const redisChat = await redis.get(chatId);
  if (redisChat === userId) {
    return {
      status: "ok",
    };
  } else {
    const [chat] = await db
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.id, chatId), eq(chatsTable.user_id, userId)));
    if (chat) {
      return {
        status: "ok",
      };
    }
    return {
      status: "error",
      error: "chat not found ",
    };
  }
};
