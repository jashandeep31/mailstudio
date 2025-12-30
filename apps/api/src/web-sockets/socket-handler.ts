import type WebSocket from "ws";
import {
  SocketEventSchemas,
  SocketEventKeySchema,
  SocketEventKey,
} from "@repo/shared";
import { handleNewChatEvent } from "./handlers/handle-new-chat-event.js";
import { handleQuestionEvent } from "./handlers/handle-question-event.js";
import z, { keyof } from "zod";
import { handleChatJoinEvent } from "./handlers/handle-chat-join-event.js";

// {"event":"event:new-chat","data":{"message":"","media":[]}}
export const SocketHandler = (socket: WebSocket) => {
  socket.send(
    JSON.stringify({
      type: "WELCOME",
      message: "Connected to server",
    }),
  );

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
        const chat = await handleNewChatEvent(data);
        socket.send(
          JSON.stringify({
            key: "res:new-chat",
            data: {
              redirectUrl: `/chat/${chat.id}`,
            },
          }),
        );
        await handleQuestionEvent({ ...data, chatId: chat.id });
        break;
      }
      case "event:joined-chat": {
        const parsedData = getParsedData(event, rawData);
        const versions = await handleChatJoinEvent(parsedData);
        console.log(versions);
        socket.send(
          JSON.stringify({
            key: "res:chat-data",
            data: {
              versions,
            },
          }),
        );
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
