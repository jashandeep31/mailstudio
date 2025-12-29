import type WebSocket from "ws";
import { SocketEventSchemas, SocketEventKeySchema } from "@repo/shared";
import { handleNewChatEvent } from "./handlers/handle-new-chat-event.js";
import { handleQuestionEvent } from "./handlers/handle-question-event.js";

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

    const data = parsedEvent.data;

    switch (event) {
      case "event:new-chat":
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
      case "event:chat-message":
        break;
    }
  });
};
