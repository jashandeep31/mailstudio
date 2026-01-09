"use client";
import Navbar from "@/components/chat/navbar";
import React, { useEffect, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@repo/ui/components/resizable";
import LeftPanel from "@/components/chat/left-panel";
import { useParams } from "next/navigation";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import { useChatStore } from "@/zustand-store/chat-store";
import { RightPanel } from "@/components/chat/right-panel";
import { useChatEventHandler } from "@/hooks/use-chat-event-handler";

const ClientView = () => {
  // hook to handle incoming events
  useChatEventHandler();
  const params = useParams();
  const [view, setView] = useState<"code" | "preview" | "edit">("preview");
  const { sendEvent } = useWebSocketContext();
  const chatVersionsMap = useChatStore((s) => s.chatVersions);
  const activeStream = useChatStore((s) => s.activeStream);
  const chatVersions = useMemo(
    () => Array.from(chatVersionsMap.values()),
    [chatVersionsMap],
  );
  useEffect(() => {
    sendEvent("event:joined-chat", {
      chatId: params.id as string,
    });
    return () => {
      sendEvent("event:left-chat", {
        chatId: params.id! as string,
      });
    };
  }, [params.id, sendEvent]);

  return (
    <div className="flex h-screen flex-col p-2">
      <Navbar />
      <div className="min-h-0 flex-1">
        {view !== "edit" && (
          <ResizablePanelGroup>
            <LeftPanel
              versions={chatVersions}
              streamingOverview={activeStream}
            />
            <ResizableHandle />
            <RightPanel view={view} setView={setView} />
          </ResizablePanelGroup>
        )}
        {/* {view === "edit" && <Editor />} */}
      </div>
    </div>
  );
};

export default ClientView;
