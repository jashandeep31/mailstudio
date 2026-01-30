// hooks/useChatEventHandler.ts
import { useEffect, useMemo } from "react";
import { useSocketEvents } from "@/zustand-store/socket-events-store";
import { useChatStore } from "@/zustand-store/chat-store";
import { ChatVersionAggregate } from "@/app/chat/[id]/types";

export const useChatEventHandler = () => {
  const events = useSocketEvents((s) => s.events);
  const deleteEvent = useSocketEvents((s) => s.deleteEvent);

  const setChatVersions = useChatStore((s) => s.setChatVersions);
  const activeStream = useChatStore((s) => s.activeStream);
  const updateChatVersion = useChatStore((s) => s.updateChatVersion);
  const setActiveStream = useChatStore((s) => s.setActiveStream);
  const setSelectedVersionId = useChatStore((s) => s.setSelectedVersionId);
  const appendChatVersion = useChatStore((s) => s.appendChatVersion);

  const eventsArray = useMemo(() => [...events.values()], [events]);

  useEffect(() => {
    for (const event of eventsArray) {
      if (event.key === "res:chat-data") {
        const versions: ChatVersionAggregate[] = event.data.versions;
        setChatVersions(versions);
        const lastVersion = versions.at(-1);
        if (lastVersion) {
          setSelectedVersionId(lastVersion.chat_versions.id);
        }
      } else if (event.key === "res:stream-answer") {
        console.log(event.data, "res:stream-answer");
        setActiveStream({
          versionId: event.data.versionId,
          chatId: event.data.chatId,
          questionId: event.data.questionId,
          response: event.data.response,
        });
      } else if (event.key === "res:new-version") {
        // New version just send by the refine template to just append something to the chat versions
        // TODO: try to handle set streaming here if found the lag in the production version
        const eventData: ChatVersionAggregate = event.data;
        appendChatVersion(eventData);
        setSelectedVersionId(event.data.chat_versions.id);
      } else if (event.key === "res:version-update") {
        updateChatVersion(event.data);
        if (activeStream) {
          console.log(`okay we had removed the active stream sir`);
          setActiveStream(null);
        }
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
    activeStream,
  ]);
};
