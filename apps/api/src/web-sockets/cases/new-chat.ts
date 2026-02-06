import { getCachedUserCreditWallet } from "../../lib/redis/user-credit-wallet-cache.js";
import { handleNewChatEvent } from "../handlers/handle-new-chat-event.js";
import { handleQuestionEvent } from "../handlers/handle-question-event.js";
import { getParsedData } from "../socket-handler.js";
import WebSocket from "ws";
import { socketErrors } from "./utils.js";
import { getUserOngoingChats } from "../../lib/redis/user-ongoing-chats.js";

export const newChatCase = async ({
  rawData,
  socket,
}: {
  rawData: unknown;
  socket: WebSocket;
}) => {
  const ongoingChats = await getUserOngoingChats(socket.userId);
  // TODO: if user balance is too low then only allow to run the one at a time
  if (ongoingChats.length > 3) {
    socket.send(socketErrors["error:too-many-ongoing-chats"]);
    return;
  }
  const data = getParsedData("event:new-chat", rawData);
  const wallet = await getCachedUserCreditWallet(socket.userId);

  if (!wallet) {
    socket.send(socketErrors["no-wallet"]);
    return;
  }
  if (Number(wallet.balance) <= 0) {
    socket.send(socketErrors["low-credits"]);
    return;
  }

  const chat = await handleNewChatEvent(data, socket);
  await handleQuestionEvent(
    {
      ...data,
      chatId: chat.id,
    },
    socket,
  );
};
