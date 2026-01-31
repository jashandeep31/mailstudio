import { BASE_URL } from "@/lib/contants";
import { chatsTable } from "@repo/db";
import axios from "axios";

export const getChats = async (): Promise<
  (typeof chatsTable.$inferSelect)[]
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/chats`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const deleteChat = async (chatId: string) => {
  const res = await axios.delete(`${BASE_URL}/api/v1/chats/${chatId}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export interface UpdateChatPayload {
  chatId: string;
  name?: string;
  public?: boolean;
  price?: string;
}

export const updateChat = async (data: UpdateChatPayload) => {
  const res = await axios.post(`${BASE_URL}/api/v1/chats`, data, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getChatById = async (
  chatId: string,
): Promise<typeof chatsTable.$inferSelect> => {
  const res = await axios.get(`${BASE_URL}/api/v1/chats/${chatId}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const likeChat = async ({
  action,
  chatId,
}: {
  action: "like" | "unlike";
  chatId: string;
}) => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/chats/like`,
    { action, chatId },
    { withCredentials: true },
  );
  return res.data;
};
