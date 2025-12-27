import type WebSocket from "ws";

export const SocketHandler = (socket: WebSocket) => {
  socket.send(
    JSON.stringify({
      type: "WELCOME",
      message: "Connected to server",
    }),
  );
  socket.on("message", (e) => {
    console.log(e.toString());
  });
};
