import { createContext, useContext, useEffect, useState } from "react";
type WebSocketState =
  | { status: "connecting" }
  | { status: "connected"; socket: WebSocket }
  | { status: "error"; error: Event }
  | { status: "closed" };

const WebSocketContext = createContext<WebSocketState>({
  status: "connecting",
});
import React from "react";

export default function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<WebSocketState>({
    status: "connecting",
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");

    ws.onopen = () => {
      setState({ status: "connected", socket: ws });
    };

    ws.onerror = (e) => {
      setState({ status: "error", error: e });
    };

    ws.onclose = () => {
      setState({ status: "closed" });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={state}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocketContext = () => {
  const ctx = useContext(WebSocketContext);

  if (ctx.status !== "connected") {
    throw new Error("WebSocket not connected");
  }

  return ctx.socket; // 🔥 only socket
};
