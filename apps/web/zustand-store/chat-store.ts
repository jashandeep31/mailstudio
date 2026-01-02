import { ChatVersionAggregate, StreamingOverview } from "@/app/chat/[id]/types";
import { create } from "zustand";

interface ChatStore {
  chatVersions: ChatVersionAggregate[];
  selectedVersion: string | null;
  setChatVersions: (versions: ChatVersionAggregate[]) => void;
  activeStream: StreamingOverview | null;
  setActiveStream: (stream: StreamingOverview) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  chatVersions: [],
  selectedVersion: null,
  setChatVersions: (versions) => set({ chatVersions: versions }),
  activeStream: null,
  setActiveStream: (stream) => set({ activeStream: stream }),
}));
