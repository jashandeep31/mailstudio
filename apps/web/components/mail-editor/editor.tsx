"use client";
import { useChatStore } from "@/zustand-store/chat-store";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/resizable";
import React, { useMemo } from "react";

export default function Editor() {
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);
  const chatVersionsMap = useChatStore((s) => s.chatVersions);
  const selectedVersion = useMemo(() => {
    if (selectedVersionId) return chatVersionsMap.get(selectedVersionId);
  }, [chatVersionsMap, selectedVersionId]);
  if (!selectedVersion) return <h1>Not chat is selected </h1>;
  return (
    <div className="h-full w-full">
      <ResizablePanelGroup>
        <ResizablePanel
          defaultSize={"25%"}
          className="flex h-full min-h-0 w-full flex-col p-3"
        >
          fasdf
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel
          defaultSize={"25%"}
          className="flex h-full min-h-0 w-full flex-col p-3"
        >
          fasdf
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
