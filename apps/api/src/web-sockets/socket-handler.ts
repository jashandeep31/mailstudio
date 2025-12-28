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
        socket.send(
          JSON.stringify({
            key: "res:fas",
            data: {
              redirectUrl: "dfa",
            },
          }),
        );
        break;
      case "event:chat-message":
        break;
    }
  });
};
