import { createContext, useContext, useEffect, useState } from "react";
import {
  SocketEventSchemas,
  SocketEventKey,
  SocketEventPayload,
} from "@repo/shared";

type SendEvent = <K extends SocketEventKey>(
  event: K,
  payload: SocketEventPayload<K>,
) => void;

interface IWebSocketContext {
  socket: WebSocket | null;
  sendEvent: SendEvent;
}

const WebSocketContext = createContext<IWebSocketContext>({
  socket: null,
  sendEvent: () => {},
});

import React from "react";

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const sendEvent: SendEvent = (event, payload) => {
    if (!socket) {
      console.log("Socket not connected");
      return;
    }
    const parsed = SocketEventSchemas[event].parse(payload);
    socket.send(
      JSON.stringify({
        event,
        data: parsed,
      }),
    );
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      console.log(e);
    };
    ws.onclose = () => {
      setSocket(null);
    };

    ws.onerror = () => {};

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        socket: socket,
        sendEvent,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocketContext = () => {
  const ctx = useContext(WebSocketContext);

  return ctx;
};
