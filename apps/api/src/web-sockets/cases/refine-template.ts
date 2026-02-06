import WebSocket from "ws";
import { getParsedData } from "../socket-handler.js";
import { checkChatAuth } from "../../lib/redis/check-chat-auth.js";
import { getCachedUserCreditWallet } from "../../lib/redis/user-credit-wallet-cache.js";
import { refineTemplateHandler } from "../handlers/refine-template-event.js";
import { socketErrors } from "./utils.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import { getUserOngoingChats } from "../../lib/redis/user-ongoing-chats.js";

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

  // checking the user have already too many running chats
  const ongoingChats = await getUserOngoingChats(socket.userId);
  if (ongoingChats.length > 3) {
    socket.send(socketErrors["error:too-many-ongoing-chats"]);
    return;
  }
  // If chat is already processing then no new version can be refined
  const isChatProcessing = ProcesingVersions.get(data.chatId);
  if (isChatProcessing) {
    socket.send(socketErrors["proccessing-error"]);
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
