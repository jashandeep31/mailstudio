interface ChatRoom {
  userId: string;
  streaming: boolean;
  questionId: string;
  onHold: boolean;
  createdAt: Date;
  leftOn: Date;
  isUserConnected: boolean;
}
export const ChatRoom = new Map<string, ChatRoom>();
