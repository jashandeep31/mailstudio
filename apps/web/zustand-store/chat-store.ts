import { ChatVersionAggregate } from "@/app/chat/[id]/types";
import { create } from "zustand";

interface ChatStore {
  chatVersions: ChatVersionAggregate[];
  selectedVersion: string | null;
  setChatVersions: (versions: ChatVersionAggregate[]) => void;
}
export const useChatStore = create<ChatStore>((set) => ({
  chatVersions: [],
  selectedVersion: null,
  setChatVersions: (versions) => set({ chatVersions: versions }),
}));
