import WebSocket from "ws";
import { getParsedData } from "../socket-handler.js";
import { checkChatAuth } from "../../lib/redis/check-chat-auth.js";
import { socketErrors } from "./utils.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import { chatRollbackEventHandler } from "../handlers/handle-chat-rollback-event.js";

export const chatRollbackCase = async ({
  rawData,
  socket,
}: {
  rawData: unknown;
  socket: WebSocket;
}) => {
  const data = getParsedData("event:chat-rollback", rawData);
  const authStatus = await checkChatAuth({
    userId: socket.userId,
    chatId: data.chatId,
  });

  if (authStatus.status !== "ok") {
    socket.send(socketErrors["not-authorized"]);
    return;
  }
  //Things to check
  // 1. Chat is not streaming something as it case issue on parentid

  const isChatProcessing = ProcesingVersions.get(data.chatId);
  if (isChatProcessing) {
    socket.send(socketErrors["proccessing-error"]);
    return;
  }

  await chatRollbackEventHandler({ data, socket });
};
