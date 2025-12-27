"use client";
import WebSocketProvider from "@/contexts/web-socket-context";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <WebSocketProvider>{children}</WebSocketProvider>
    </div>
  );
}
