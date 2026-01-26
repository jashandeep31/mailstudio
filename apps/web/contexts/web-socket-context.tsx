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
import { v4 as uuid } from "uuid";

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
import { useRouter } from "next/navigation";
import { useSocketEvents } from "@/zustand-store/socket-events-store";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/contants";

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const addEvent = useSocketEvents((s) => s.addEvent);
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptCountRef = useRef(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const isConnectedRef = useRef(false);
  const pendingMessagesRef = useRef<Array<string>>([]);

  const sendEvent = useCallback<SendEvent>((event, payload) => {
    const parsed = SocketEventSchemas[event].parse(payload);
    const payloadString = JSON.stringify({
      event,
      data: parsed,
    });
    if (!isConnectedRef.current || !socketRef.current) {
      pendingMessagesRef.current.push(payloadString);
      return;
    }
    socketRef.current.send(payloadString);
  }, []);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  const socketOnMessageHandler = useCallback(
    (e: MessageEvent<string>) => {
      const rawData = JSON.parse(e.data);
      const key = rawData.key;
      const data = rawData.data;
      switch (key) {
        case "res:new-chat":
          router.push(`${data.redirectUrl}`);
          break;
        case "error:no-chat":
          router.push(`/dashboard`);
          break;
        case "error:wallet":
          console.log(data);
          toast.error(data.message || "Wallet doesn't have the enough balacne");
          break;
        default:
          addEvent({
            id: uuid(),
            data,
            key: key,
          });
      }
    },
    [router, addEvent],
  );
  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`ws://${BASE_URL}`);

      ws.onopen = () => {
        socketRef.current = ws;
        isConnectedRef.current = true;
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
        socketRef.current = null;
        isConnectedRef.current = false;
        setSocket(null);
        setIsConnected(false);

        // Attempting to reconnect to the server
        if (reconnectAttemptCountRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptCountRef.current++;
          setTimeout(() => {
            connect();
          }, RECONNECT_INTERVAL);
        }
      };

      ws.onerror = () => {};
    } catch {
      console.log(`error in the ws`);
    }
  }, [socketOnMessageHandler]);

  useEffect(() => {
    connect();
  }, [connect]);

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
