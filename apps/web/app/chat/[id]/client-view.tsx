"use client";
import Navbar from "@/components/chat/navbar";
import React, { useEffect, useMemo } from "react";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@repo/ui/components/resizable";
import LeftPanel from "@/components/chat/left-panel";
import { useParams } from "next/navigation";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import { useSocketEvents } from "@/zustand-store/socket-events-store";
import { useChatStore } from "@/zustand-store/chat-store";
import { RightPanel } from "@/components/chat/right-panel";
import { ChatVersionAggregate } from "./types";
import {
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
} from "@repo/db";

interface SocketResposneVersion {
  chat_versions: typeof chatVersionsTable.$inferSelect;
  chat_version_prompts: typeof chatVersionPromptsTable.$inferSelect;
  chat_version_outputs: typeof chatVersionOutputsTable.$inferSelect;
}

const ClientView = () => {
  const params = useParams();
  const { sendEvent } = useWebSocketContext();
  // chat store
  const events = useSocketEvents((s) => s.events);
  const deleteEvent = useSocketEvents((s) => s.deleteEvent);
  const chatVersionsMap = useChatStore((s) => s.chatVersions);
  const setChatVersions = useChatStore((s) => s.setChatVersions);
  const activeStream = useChatStore((s) => s.activeStream);
  const updateChatVersion = useChatStore((s) => s.updateChatVersion);
  const setActiveStream = useChatStore((s) => s.setActiveStream);
  const setSelectedVersionId = useChatStore((s) => s.setSelectedVersionId);
  const appendChatVersion = useChatStore((s) => s.appendChatVersion);
  // converting to the array
  const eventsArray = useMemo(() => [...events.values()], [events]);
  const chatVersions = useMemo(
    () => Array.from(chatVersionsMap.values()),
    [chatVersionsMap],
  );
  useEffect(() => {
    for (const event of eventsArray) {
      if (event.key === "res:chat-data") {
        const versions: ChatVersionAggregate[] = event.data
          .versions as SocketResposneVersion[];
        setChatVersions(versions);
        const lastVersion = versions.at(-1);
        if (lastVersion) {
          setSelectedVersionId(lastVersion.chat_versions.id);
        }
      } else if (event.key === "res:stream-answer") {
        setActiveStream({
          versionId: event.data.versionId,
          chatId: event.data.chatId,
          questionId: event.data.questionId,
          response: event.data.response,
        });
      } else if (event.key === "res:new-version") {
        const eventData: ChatVersionAggregate = event.data;
        appendChatVersion(eventData);
        if (eventData.chat_versions.id === activeStream?.versionId) {
          setActiveStream(null);
        }
        setSelectedVersionId(event.data.chat_versions.id);
      } else if (event.key === "res:version-update") {
        updateChatVersion(event.data);
      }
      deleteEvent(event.id);
    }
  }, [
    eventsArray,
    setActiveStream,
    setChatVersions,
    setSelectedVersionId,
    appendChatVersion,
    deleteEvent,
    updateChatVersion,
    activeStream?.versionId,
  ]);

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
        <ResizablePanelGroup>
          <LeftPanel versions={chatVersions} streamingOverview={activeStream} />
          <ResizableHandle />
          <RightPanel />
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ClientView;
