import WebSocket from "ws";
import { checkChatAuth } from "../../lib/redis/check-chat-auth.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import { handleChatJoinEvent } from "../handlers/handle-chat-join-event.js";
import { getParsedData } from "../socket-handler.js";
import { socketErrors } from "./utils.js";

export const joinedChat = async ({
  rawData,
  socket,
}: {
  rawData: unknown;
  socket: WebSocket;
}) => {
  const data = getParsedData("event:joined-chat", rawData);
  const authStatus = await checkChatAuth({
    userId: socket.userId,
    chatId: data.chatId,
  });

  if (authStatus.status !== "ok") {
    socket.send(socketErrors["not-authorized"]);
    return;
  }

  await handleChatJoinEvent(data, socket);

  const ProcesingVersion = ProcesingVersions.get(`${data.chatId}`);

  // send the user update of the chat
  if (!ProcesingVersion) return;
  socket.send(
    JSON.stringify({
      key: "res:stream-answer",
      data: {
        versionId: ProcesingVersion.versionId,
        chatId: ProcesingVersion.chatId,
        questionId: ProcesingVersion.questionId,
        response: ProcesingVersion.overviewOutput || "",
      },
    }),
  );
  ProcesingVersion.sockets.add(socket);
};
