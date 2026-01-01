import type WebSocket from "ws";
import { SocketEventSchemas, SocketEventKeySchema } from "@repo/shared";
import { handleNewChatEvent } from "./handlers/handle-new-chat-event.js";
import { handleQuestionEvent } from "./handlers/handle-question-event.js";
import z from "zod";
import { handleChatJoinEvent } from "./handlers/handle-chat-join-event.js";

export const SocketHandler = async (socket: WebSocket) => {
  socket.on("message", async (e) => {
    const { event: rawEvent, data: rawData } = JSON.parse(e.toString());
    const event = SocketEventKeySchema.parse(rawEvent);
    const parsedEvent = SocketEventSchemas[event].safeParse(rawData);
    if (!parsedEvent.success) {
      console.log(`errors`);
      return;
    }

    switch (event) {
      case "event:new-chat": {
        const data = getParsedData(event, rawData);
        const chat = await handleNewChatEvent(data, socket);
        await handleQuestionEvent(
          {
            ...data,
            chatId: chat.id,
          },
          socket,
        );
        break;
      }
      case "event:joined-chat": {
        const data = getParsedData(event, rawData);
        await handleChatJoinEvent(data, socket);
        break;
      }
      case "event:chat-message":
        break;
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
