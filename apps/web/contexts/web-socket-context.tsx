import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SocketEventSchemas,
  SocketEventKey,
  SocketEventPayload,
} from "@repo/shared";

// constants
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 3000; // is eq to 3sec

type SendEvent = <K extends SocketEventKey>(
  event: K,
  payload: SocketEventPayload<K>,
) => void;
interface IWebSocketContext {
  socket: WebSocket | null;
  sendEvent: SendEvent;
  isConnected: boolean;
  reconnect: () => void;
}

const WebSocketContext = createContext<IWebSocketContext>({
  socket: null,
  sendEvent: () => {},
  isConnected: false,
  reconnect: () => {},
});

import React from "react";
import { redirect } from "next/navigation";

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectAttemptCountRef = useRef(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const pendingMessagesRef = useRef<Array<string>>([]);

  const sendEvent: SendEvent = (event, payload) => {
    const parsed = SocketEventSchemas[event].parse(payload);
    const payloadString = JSON.stringify({
      event,
      data: parsed,
    });
    if (!isConnected || !socket) {
      pendingMessagesRef.current.push(payloadString);
      return;
    }
    socket.send(payloadString);
  };

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket("ws://localhost:8000");
      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
        // Reseting for the next retry
        reconnectAttemptCountRef.current = 0;
        // sending the pending messages
        while (pendingMessagesRef.current.length > 0) {
          const payloadString = pendingMessagesRef.current.shift();
          if (payloadString) ws.send(payloadString);
        }
      };
      ws.onmessage = (e) => {
        socketOnMessageHandler(e);
      };
      ws.onclose = () => {
        setSocket(null);
        setIsConnected(false);

        // Attempting to reconnect to the server
        if (reconnectAttemptCountRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptCountRef.current++;
          connect();
          setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL);
        }
      };

      ws.onerror = () => {};
    } catch {
      console.log(`errro is thies`);
    }
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  const socketOnMessageHandler = (e: MessageEvent<string>) => {
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
        reconnect: connect,
        isConnected,
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
