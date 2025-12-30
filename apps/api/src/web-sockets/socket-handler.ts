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

// {"event":"event:new-chat","data":{"message":"","media":[]}}
export const SocketHandler = async (socket: WebSocket) => {
  socket.send(
    JSON.stringify({
      type: "WELCOME",
      message: "Connected to server",
    }),
  );
  const string = `l Studio
create the mail template for user to verify the mail by clicking the button below he has the new signup on our platform. If he doesn't done it then don't perform any action we willa uto delete on the no verificationWorking.. I'll create a login page inspired by the Apollo.io design you shared. Let me first understand your codebase structure, then build the login page component.`;

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
        let str2 = "";
        for (const char of string) {
          await new Promise((resolve) => setTimeout(resolve, 10));
          str2 += char;
          socket.send(
            JSON.stringify({
              key: "res:stream-answer",
              data: {
                versionId: "82c0a77e-bfa6-4349-b5d7-03bb7d7aa875",
                chatId: "ec596619-1b42-47ed-8ea0-3876e194fdbf",
                questionId: "56b2b3ce-3912-4a2f-acec-9b0d573221bb",
                response: str2,
              },
            }),
          );
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
