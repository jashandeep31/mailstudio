"use client";
import Navbar from "@/components/chat/navbar";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/resizable";
import LeftPanel from "@/components/chat/left-panel";
import { useParams } from "next/navigation";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import {
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
} from "@repo/db";

export interface Version {
  chat_versions: typeof chatVersionsTable.$inferSelect;
  chat_version_prompts?: typeof chatVersionPromptsTable.$inferSelect;
  chat_verion_outputs?: typeof chatVersionOutputsTable.$inferSelect;
}

const ClientView = () => {
  const params = useParams();
  const { sendEvent, socket } = useWebSocketContext();

  const [versions, setVersions] = useState<Version[]>([]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (e) => {
        const parsedData = JSON.parse(e.data);
        if (parsedData.key === "res:chat-data") {
          setVersions(parsedData.data.versions);
        }
      };
    }
  }, [socket]);

  useEffect(() => {
    sendEvent("event:joined-chat", {
      chatId: params.id as string,
    });
    return () => {};
  }, [params.id, sendEvent]);

  return (
    <div className="flex min-h-screen flex-col p-2">
      <Navbar />
      <div className="grid flex-1">
        <ResizablePanelGroup className="h-full">
          <LeftPanel versions={versions} />
          <ResizableHandle />
          <ResizablePanel></ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ClientView;
