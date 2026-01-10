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

export const updateChat = async (data: unknown) => {
  const res = await axios.post(`${BASE_URL}/api/v1/chats`, data, {
    withCredentials: true,
  });
  return res.data.data;
};
