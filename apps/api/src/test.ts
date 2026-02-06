import {
  addUserOngoingChat,
  getUserOngoingChats,
  removeUserOngoingChat,
} from "./lib/redis/user-ongoing-chats.js";

export async function test() {
  // adding the chatId to the
  await addUserOngoingChat("test", "chatId");
  await addUserOngoingChat("test", "chatId1");
  await addUserOngoingChat("test", "chatId2");
  await addUserOngoingChat("test", "chatId3");
  const data = await getUserOngoingChats("test");
  console.log(data.length, data);
  console.log("Test is fired 🔥 up ");
}
