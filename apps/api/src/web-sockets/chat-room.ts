type ChatRoom = {
  chatId: string;
  socket: WebSocket | null;
  abortController: AbortController | null;
  pendingStream: {
    questionId: string;
    question: string;
  } | null;
};
export const ChatRoom = new Map<string, ChatRoom>();
