import {
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
} from "@repo/db";
import { redis } from "../db.js";

interface ChatVersionAggregate {
  chat_versions: typeof chatVersionsTable.$inferSelect;
  chat_version_prompts?: typeof chatVersionPromptsTable.$inferSelect;
  chat_version_outputs?: typeof chatVersionOutputsTable.$inferSelect;
}
const getKey = (id: string) => {
  return `ongoing-chat-version::${id}`;
};
export const getOngoingNewChatVersion = async (
  id: string,
): Promise<string | null> => {
  const data = await redis.get(getKey(id));
  if (data) {
    return JSON.parse(data);
  }
  return null;
};

export const saveOngoingNewChatVersion = async (data: ChatVersionAggregate) => {
  await redis.set(
    getKey(data.chat_versions.chat_id),
    JSON.stringify(data),
    "EX",
    5 * 60,
  );
};
export const removeOngoingNewChatVersion = async (id: string) => {
  await redis.del(getKey(id));
};
