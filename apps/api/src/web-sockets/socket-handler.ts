import type WebSocket from "ws";
import { SocketEventSchemas, SocketEventKeySchema } from "@repo/shared";

// {"event":"event:new-chat","data":{"message":"","media":[]}}
export const SocketHandler = (socket: WebSocket) => {
  socket.send(
    JSON.stringify({
      type: "WELCOME",
      message: "Connected to server",
    }),
  );

  socket.on("message", (e) => {
    const { rawEvent, data } = JSON.parse(e.toString());
    const event = SocketEventKeySchema.parse(rawEvent);
    const parsed = SocketEventSchemas[event].parse(data);

    switch (event) {
      case "event:new-chat":
        break;
      case "event:chat-message":
        break;
    }
  });
};
