"use client";
import { useChatStore } from "@/zustand-store/chat-store";
import React, { useMemo } from "react";

import { ChatVersionAggregate } from "@/app/chat/[id]/types";

const MainEditor = ({
  selectedVersion,
}: {
  selectedVersion: ChatVersionAggregate;
}) => {
  return <div>editor</div>;
};

export default function Editor() {
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);
  const chatVersionsMap = useChatStore((s) => s.chatVersions);
  const selectedVersion = useMemo(() => {
    if (selectedVersionId) return chatVersionsMap.get(selectedVersionId);
  }, [chatVersionsMap, selectedVersionId]);
  if (!selectedVersion) return <h1>Not chat is selected </h1>;
  return <MainEditor selectedVersion={selectedVersion} />;
}
