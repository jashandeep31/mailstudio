"use client";
import Navbar from "@/components/chat/navbar";
import React, { useEffect, useMemo, useState } from "react";
import LeftPanel from "@/components/chat/left-panel";
import { useParams } from "next/navigation";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import { useChatStore } from "@/zustand-store/chat-store";
import { RightPanel } from "@/components/chat/right-panel";
import { useChatEventHandler } from "@/hooks/use-chat-event-handler";
import { Button } from "@repo/ui/components/button";
import EditorWrapper from "@/components/mail-editor/editor";

const ClientView = () => {
  // hook to handle incoming events
  useChatEventHandler();
  const [mobileView, setMobileView] = useState<"chat" | "preview">("chat");
  const params = useParams();
  const [view, setView] = useState<"code" | "preview" | "edit">("preview");
  const { sendEvent } = useWebSocketContext();
  const chatVersionsMap = useChatStore((s) => s.chatVersions);
  const activeStream = useChatStore((s) => s.activeStream);
  const resetChat = useChatStore((s) => s.resetChat);
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
      resetChat();
    };
  }, [params.id, sendEvent, resetChat]);

  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      {/* desktop view only  */}
      <div className="hidden min-h-0 flex-1 grid-cols-4 md:grid">
        {view !== "edit" ? (
          <>
            <div className="grid min-h-0 border-r md:col-span-2 lg:col-span-1">
              <LeftPanel
                versions={chatVersions}
                streamingOverview={activeStream}
              />
            </div>
            <div className="grid min-h-0 md:col-span-2 lg:col-span-3">
              <RightPanel view={view} setView={setView} />
            </div>
          </>
        ) : (
          <div className="col-span-4">
            <EditorWrapper view={view} setView={setView} />
          </div>
        )}
      </div>

      {/* mobile view */}
      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <div className="bg-muted flex rounded-md p-1">
          <Button
            variant={mobileView === "chat" ? "default" : "ghost"}
            size={"sm"}
            className="flex-1"
            onClick={() => setMobileView("chat")}
          >
            Chat
          </Button>
          <Button
            variant={mobileView === "preview" ? "default" : "ghost"}
            size={"sm"}
            className="flex-1"
            onClick={() => setMobileView("preview")}
          >
            Preview
          </Button>
        </div>

        {mobileView === "chat" && (
          <LeftPanel versions={chatVersions} streamingOverview={activeStream} />
        )}
        {mobileView === "preview" && (
          <div className="grid h-full min-h-0 flex-1">
            <RightPanel view={view} setView={setView} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientView;
