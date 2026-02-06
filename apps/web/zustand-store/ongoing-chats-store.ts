import { create } from "zustand";

interface OngoingChatsStore {
  chatIds: Set<string>;
  appendOngoingChatId: (chatId: string) => void;
  removeOngoingChatId: (chatId: string) => void;
  setOngoingChatIds: (chatIds: string[]) => void;
}

export const useOngoingChatsStore = create<OngoingChatsStore>((set) => ({
  chatIds: new Set(),

  appendOngoingChatId: (chatId) =>
    set((state) => {
      const next = new Set(state.chatIds);
      next.add(chatId);
      return { chatIds: next };
    }),

  removeOngoingChatId: (chatId) =>
    set((state) => {
      const next = new Set(state.chatIds);
      next.delete(chatId);
      return { chatIds: next };
    }),

  setOngoingChatIds: (chatIds) =>
    set(() => {
      const set = new Set(chatIds);
      return { chatIds: set };
    }),
}));
