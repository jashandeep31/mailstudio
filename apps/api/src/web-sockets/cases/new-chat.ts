import { SocketEventKey } from "@repo/shared";
import { getCachedUserCreditWallet } from "../../lib/redis/user-credit-wallet-cache.js";
import { handleNewChatEvent } from "../handlers/handle-new-chat-event.js";
import { handleQuestionEvent } from "../handlers/handle-question-event.js";
import { getParsedData } from "../socket-handler.js";
import WebSocket from "ws";
import { socketErrors } from "./utils.js";

export const newChatCase = async ({
  rawData,
  socket,
}: {
  rawData: unknown;
  socket: WebSocket;
}) => {
  const data = getParsedData("event:new-chat", rawData);
  const wallet = await getCachedUserCreditWallet(socket.userId);

  if (!wallet) {
    socket.send(socketErrors["no-wallet"]);
    return;
  }
  if (Number(wallet.balance) <= 0) {
    socket.send(socketErrors["error:low-credits"]);
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
