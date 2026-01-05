import { ChatVersionAggregate, StreamingOverview } from "@/app/chat/[id]/types";
import { version } from "os";
import { create } from "zustand";

interface ChatStore {
  chatVersions: ChatVersionAggregate[];
  selectedVersion: ChatVersionAggregate | null;
  setSelectedVersion: (version: ChatVersionAggregate) => void;
  setChatVersions: (versions: ChatVersionAggregate[]) => void;
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
}));
