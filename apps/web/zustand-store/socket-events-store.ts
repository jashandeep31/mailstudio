import { create } from "zustand";
type SocketEvent = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  key: string;
};

interface UseSocketEvents {
  events: Map<string, SocketEvent>;
  addEvent: (event: SocketEvent) => void;
  deleteEvent: (id: string) => void;
}
export const useSocketEvents = create<UseSocketEvents>((set) => ({
  events: new Map(),
  deleteEvent: (id) =>
    set((state) => {
      const next = new Map(state.events);
      next.delete(id);
      return { events: next };
    }),

  addEvent: (event) =>
    set((state) => {
      const next = new Map(state.events);
      next.set(event.id, event);
      return { events: next };
    }),
}));
