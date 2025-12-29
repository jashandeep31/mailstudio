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
import { redirect } from "next/navigation";

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
      socketOnMessageHandler(e);
    };
    ws.onclose = () => {
      setSocket(null);
    };

    ws.onerror = () => {};

    return () => {
      ws.close();
    };
  }, []);

  const socketOnMessageHandler = (e: MessageEvent<any>) => {
    const rawData = JSON.parse(e.data);
    const key = rawData.key;
    const data = rawData.data;
    switch (key) {
      case "res:new-chat":
        redirect(data.redirectUrl);
    }
  };

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
