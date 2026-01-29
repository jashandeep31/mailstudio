import WebSocket from "ws";
import { getParsedData } from "../socket-handler.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";

export const leftChatCase = async ({
  rawData,
  socket,
}: {
  rawData: unknown;
  socket: WebSocket;
}) => {
  const data = getParsedData("event:left-chat", rawData);
  const ProcesingVersion = ProcesingVersions.get(`${data.chatId}`);
  if (!ProcesingVersion) return;
  ProcesingVersion.sockets.delete(socket);
};
