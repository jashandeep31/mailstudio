import { redis } from "../db.js";

const getKey = (userId: string) => `user-ongoing-chats::${userId}`;

export const getUserOngoingChats = async (userId: string) => {
  const key = getKey(userId);
  return await redis.smembers(key);
};

export const addUserOngoingChat = async (userId: string, chatId: string) => {
  const key = getKey(userId);
  await redis.sadd(key, chatId);
  // expiring the each key after the 5min
  await redis.expire(key, 5 * 60);
};

export const removeUserOngoingChat = async (userId: string, chatId: string) => {
  const key = getKey(userId);
  await redis.srem(key, chatId);
};
