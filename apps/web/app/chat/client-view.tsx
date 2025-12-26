"use client";
import Navbar from "@/components/chat/navbar";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/resizable";
import LeftPanel from "@/components/chat/left-panel";

const ClientView = () => {
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
