import type WebSocket from "ws";
import { SocketEventSchemas, SocketEventKeySchema } from "@repo/shared";
import { handleNewChatEvent } from "./handlers/handle-new-chat-event.js";
import { handleQuestionEvent } from "./handlers/handle-question-event.js";
import z from "zod";
import { handleChatJoinEvent } from "./handlers/handle-chat-join-event.js";
import { ProcesingVersions } from "../state/processing-versions-state.js";
import { refineTemplateHandler } from "./handlers/refine-template-event.js";
import { checkChatAuth } from "../lib/redis/check-chat-auth.js";

export const SocketHandler = async (socket: WebSocket) => {
  socket.on("message", async (e) => {
    try {
      const { event: rawEvent, data: rawData } = JSON.parse(e.toString());
      const event = SocketEventKeySchema.parse(rawEvent);
      const parsedEvent = SocketEventSchemas[event].safeParse(rawData);
      if (!parsedEvent.success) {
        console.log(`errors`);
        return;
      }

      console.log(event, new Date().toLocaleDateString());
      switch (event) {
        case "event:new-chat": {
          const data = getParsedData(event, rawData);
          const chat = await handleNewChatEvent(data, socket);
          await handleQuestionEvent(
            {
              type: "new",
              ...data,
              chatId: chat.id,
            },
            socket,
          );
          break;
        }

        case "event:joined-chat": {
          const data = getParsedData(event, rawData);
          const authStatus = await checkChatAuth({
            userId: socket.userId,
            chatId: data.chatId,
          });
          if (authStatus.status !== "ok") {
            socket.send(
              JSON.stringify({
                key: "error:no-chat",
                data: null,
              }),
            );
            return;
          }
          await handleChatJoinEvent(data, socket);
          const ProcesingVersion = ProcesingVersions.get(
            `${socket.userId}::${data.chatId}`,
          );
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
          break;
        }

        case "event:left-chat": {
          const data = getParsedData(event, rawData);
          const ProcesingVersion = ProcesingVersions.get(
            `${socket.userId}::${data.chatId}`,
          );
          if (!ProcesingVersion) return;
          ProcesingVersion.sockets.delete(socket);
          break;
        }

        case "event:refine-template-message": {
          const data = getParsedData(event, rawData);
          const authStatus = await checkChatAuth({
            userId: socket.userId,
            chatId: data.chatId,
          });
          if (authStatus.status !== "ok") {
            socket.send(
              JSON.stringify({
                key: "error:no-chat",
                data: null,
              }),
            );
          }
          refineTemplateHandler({ data, socket });
          break;
        }
      }
    } catch (error) {
      console.error("WebSocket message handler error:", error);
      socket.send(
        JSON.stringify({
          key: "error:server",
          data: { message: "An error occurred processing your request" },
        }),
      );
    }
  });
};
export const getParsedData = <K extends keyof typeof SocketEventSchemas>(
  event: K,
  rawData: unknown,
): z.infer<(typeof SocketEventSchemas)[K]> => {
  const schema = SocketEventSchemas[event] as (typeof SocketEventSchemas)[K];
  const parsedResult = schema.safeParse(rawData);
  if (!parsedResult.success) {
    throw new Error("something went wrong");
  }
  return parsedResult.data as z.infer<(typeof SocketEventSchemas)[K]>;
};
function startStream(arg0: {
  chatId: string;
  socket: WebSocket;
  questionId: any;
  question: any;
}) {
  throw new Error("Function not implemented.");
}
