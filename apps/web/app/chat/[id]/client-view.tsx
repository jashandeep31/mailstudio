"use client";
import Navbar from "@/components/chat/navbar";
import React, { useEffect, useMemo, useState } from "react";
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
import { useSocketEvents } from "@/zustand-store/socket-events-store";

export interface Version {
  chat_versions: typeof chatVersionsTable.$inferSelect;
  chat_version_prompts?: typeof chatVersionPromptsTable.$inferSelect;
  chat_version_outputs?: typeof chatVersionOutputsTable.$inferSelect;
}

export type StreamingOverview = {
  versionId: string;
  chatId: string;
  questionId: string;
  response: string;
} | null;
const ClientView = () => {
  const { events } = useSocketEvents();
  const eventsArray = useMemo(() => [...events.values()], [events]);

  const params = useParams();
  const { sendEvent } = useWebSocketContext();
  const [streamingOverview, setStreamingOverview] =
    useState<StreamingOverview>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  useEffect(() => {
    for (const event of eventsArray) {
      if (event.key === "res:chat-data") {
        setVersions(event.data.versions);
      } else if (event.key === "res:stream-answer") {
        setStreamingOverview({
          versionId: event.data.versionId,
          chatId: event.data.chatId,
          questionId: event.data.questionId,
          response: event.data.response,
        });
      }
    }
  }, [eventsArray]);

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
    <div className="flex min-h-screen flex-col p-2">
      <Navbar />
      <div className="grid flex-1">
        <ResizablePanelGroup className="h-full">
          <LeftPanel
            versions={versions}
            streamingOverview={streamingOverview}
          />
          <ResizableHandle />
          <ResizablePanel></ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ClientView;
