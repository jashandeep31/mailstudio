import { ChatVersionAggregate, StreamingOverview } from "@/app/chat/[id]/types";
import { versions } from "process";
import { create } from "zustand";

interface ChatStore {
  chatVersions: ChatVersionAggregate[];
  selectedVersion: ChatVersionAggregate | null;
  setSelectedVersion: (version: ChatVersionAggregate) => void;
  setChatVersions: (versions: ChatVersionAggregate[]) => void;
  appendChatVersion: (version: ChatVersionAggregate) => void;
  updateChatVersion: (version: ChatVersionAggregate) => void;
  activeStream: StreamingOverview | null;
  setActiveStream: (stream: StreamingOverview) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  chatVersions: [],
  selectedVersion: null,
  setSelectedVersion: (version: ChatVersionAggregate) =>
    set({ selectedVersion: version }),
  setChatVersions: (versions) => set({ chatVersions: versions }),
  activeStream: null,
  setActiveStream: (stream) => set({ activeStream: stream }),
  appendChatVersion: (version) =>
    set((state) => ({
      chatVersions: [...state.chatVersions, version],
    })),
  updateChatVersion: (version: ChatVersionAggregate) =>
    set((state) => ({
      chatVersions: state.chatVersions.map((prev) =>
        prev.chat_versions.id === version.chat_versions.id ? version : prev,
      ),
    })),
}));
