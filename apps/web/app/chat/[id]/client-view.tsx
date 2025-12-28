"use client";
import Navbar from "@/components/chat/navbar";
import React, { useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/resizable";
import LeftPanel from "@/components/chat/left-panel";
import { useWebSocketContext } from "@/contexts/web-socket-context";

const ClientView = () => {
  const ws = useWebSocketContext();
  useEffect(() => {
    if (ws) {
      ws.send("This is working");
    }
    return () => {};
  }, [ws]);

  return (
    <div className="flex min-h-screen flex-col p-2">
      <Navbar />
      <div className="grid flex-1">
        <ResizablePanelGroup className="h-full">
          <LeftPanel />
          <ResizableHandle />
          <ResizablePanel></ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ClientView;
