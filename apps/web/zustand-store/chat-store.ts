import { ChatVersionAggregate, StreamingOverview } from "@/app/chat/[id]/types";
import { create } from "zustand";
interface ChatStore {
  chatVersions: Map<string, ChatVersionAggregate>;
  selectedVersionId: string | null;
  setSelectedVersionId: (id: string) => void;
  setChatVersions: (versions: ChatVersionAggregate[]) => void;
  appendChatVersion: (version: ChatVersionAggregate) => void;
  updateChatVersion: (version: ChatVersionAggregate) => void;
  activeStream: StreamingOverview | null;
  setActiveStream: (stream: StreamingOverview) => void;
  resetChat: () => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  chatVersions: new Map<string, ChatVersionAggregate>(),
  selectedVersionId: null,
  setSelectedVersionId: (id: string) => set({ selectedVersionId: id }),
  setChatVersions: (versions) =>
    set(() => ({
      chatVersions: new Map(versions.map((v) => [v.chat_versions.id, v])),
    })),
  activeStream: null,
  setActiveStream: (stream) => set({ activeStream: stream }),
  appendChatVersion: (version) =>
    set((state) => {
      const map = new Map(state.chatVersions);
      map.set(version.chat_versions.id, version);
      return { chatVersions: map };
    }),
  updateChatVersion: (version: ChatVersionAggregate) =>
    set((state) => {
      if (!state.chatVersions.get(version.chat_versions.id)) {
        return state;
      }
      const map = new Map(state.chatVersions);
      map.set(version.chat_versions.id, version);
      return { chatVersions: map };
    }),
  resetChat: () =>
    set({
      chatVersions: new Map<string, ChatVersionAggregate>(),
      selectedVersionId: null,
      activeStream: null,
    }),
}));
