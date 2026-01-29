import WebSocket, { WebSocketServer } from "ws";
import { getParsedData, SocketHandler } from "../socket-handler.js";
import { checkChatAuth } from "../../lib/redis/check-chat-auth.js";
import { getCachedUserCreditWallet } from "../../lib/redis/user-credit-wallet-cache.js";
import { refineTemplateHandler } from "../handlers/refine-template-event.js";
import { socketErrors } from "./utils.js";

export const refineTemplateCase = async ({
  rawData,
  socket,
}: {
  rawData: unknown;
  socket: WebSocket;
}) => {
  const data = getParsedData("event:refine-template-message", rawData);
  const authStatus = await checkChatAuth({
    userId: socket.userId,
    chatId: data.chatId,
  });

  if (authStatus.status !== "ok") {
    socket.send(socketErrors["not-authorized"]);
    return;
  }

  const wallet = await getCachedUserCreditWallet(socket.userId);
  if (!wallet) {
    socket.send(socketErrors["no-wallet"]);
    return;
  }

  if (Number(wallet.balance) <= 0) {
    socket.send(socketErrors["low-credits"]);
    return;
  }
  await refineTemplateHandler({ data, socket });
  return;
};
