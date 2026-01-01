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
import { streamAndHandleQuestionOverview } from "./functions/stream-and-handle-question-overview.js";
import { ChatRoom } from "./chat-room.js";

// {"event":"event:new-chat","data":{"message":"","media":[]}}
export const SocketHandler = async (socket: WebSocket) => {
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
        const { chatQuestion } = await handleQuestionEvent({
          ...data,
          chatId: chat.id,
        });
        if (!chatQuestion) throw new Error("Something went wrong");
        // streamAndHandleQuestionOverview({
        //   chatId: chat.id,
        //   questionId: chatQuestion.id,
        //   question: chatQuestion.prompt,
        //   socket,
        // });

        break;
      }
      case "event:joined-chat": {
        const parsedData = getParsedData(event, rawData);
        const versions = await handleChatJoinEvent(parsedData);
        socket.send(
          JSON.stringify({
            key: "res:chat-data",
            data: {
              versions,
            },
          }),
        );
        const chatRoom = ChatRoom.get(parsedData.chatId);
        if (!chatRoom) return;
        // chatRoom.socket = socket;
        // socket.once("close", () => {
        //   chatRoom.abortController?.abort();
        //   ChatRoom.delete(parsedData.chatId);
        // });
        if (chatRoom.pendingStream) {
          startStream({
            chatId: parsedData.chatId,
            socket,
            questionId: chatRoom.pendingStream.questionId,
            question: chatRoom.pendingStream.question,
          });
        }

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
