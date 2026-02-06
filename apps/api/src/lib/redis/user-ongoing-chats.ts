import { WebSocket } from "ws";
import { redis } from "../db.js";

const getKey = (userId: string) => `user-ongoing-chats::${userId}`;

export const getUserOngoingChats = async (userId: string) => {
  const key = getKey(userId);
  return await redis.smembers(key);
};

const addUserOngoingChat = async (userId: string, chatId: string) => {
  const key = getKey(userId);
  await redis.sadd(key, chatId);
  // expiring the each key after the 5min
  await redis.expire(key, 5 * 60);
};
const removeUserOngoingChat = async (userId: string, chatId: string) => {
  const key = getKey(userId);
  await redis.srem(key, chatId);
};

export const appendUserOngoingChatAndEvent = async ({
  userId,
  chatId,
  socket,
}: {
  userId: string;
  chatId: string;
  socket: WebSocket;
}) => {
  await addUserOngoingChat(userId, chatId);
  socket.send(
    JSON.stringify({
      key: "res:append-going-chat",
      data: {
        chatId,
      },
    }),
  );
};

export const removeUserOngoingChatAndEvent = async ({
  userId,
  chatId,
  socket,
}: {
  userId: string;
  chatId: string;
  socket: WebSocket;
}) => {
  await removeUserOngoingChat(userId, chatId);
  socket.send(
    JSON.stringify({
      key: "res:remove-going-chat",
      data: {
        chatId,
      },
    }),
  );
};
