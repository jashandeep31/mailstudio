import type WebSocket from "ws";
import { SocketEventSchemas, SocketEventKeySchema } from "@repo/shared";
import { z } from "zod";
import { env } from "../lib/env.js";
import { newChatCase } from "./cases/new-chat.js";
import { joinedChat } from "./cases/joined-chat.js";
import { refineTemplateCase } from "./cases/refine-template.js";
import { socketErrors } from "./cases/utils.js";
import { leftChatCase } from "./cases/left-chat.js";
import { chatRollbackCase } from "./cases/chat-rollback.js";

export const SocketHandler = async (socket: WebSocket) => {
  socket.on("message", async (e) => {
    try {
      const { event: rawEvent, data: rawData } = JSON.parse(e.toString());
      const event = SocketEventKeySchema.parse(rawEvent);
      const parsedEvent = SocketEventSchemas[event].safeParse(rawData);
      if (!parsedEvent.success) return;

      if (env.ENVIRONMENT === "development")
        console.log(event, new Date().toLocaleDateString());

      switch (event) {
        case "event:new-chat": {
          await newChatCase({ rawData, socket });
          break;
        }

        case "event:joined-chat": {
          await joinedChat({ rawData, socket });
          break;
        }

        case "event:left-chat": {
          await leftChatCase({ rawData, socket });
          break;
        }

        case "event:refine-template-message": {
          await refineTemplateCase({ rawData, socket });
          break;
        }

        case "event:chat-rollback": {
          await chatRollbackCase({ rawData, socket });
          break;
        }
      }
    } catch (error) {
      console.error("WebSocket message handler error:", error);
      socket.send(socketErrors["server-error"]);
    }
  });
};

// parse and return data using the zod schema
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
