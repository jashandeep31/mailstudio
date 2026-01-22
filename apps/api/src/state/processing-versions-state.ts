// on the basis ov

import { WebSocket } from "ws";

// userid::chatid
interface ProcesingVersion {
  chatId: string;
  questionId: string;
  versionId: string;
  overviewOutput: string;
  isDone: boolean;
  sockets: Set<WebSocket>;
  abortController: AbortController;
}
export const ProcesingVersions = new Map<string, ProcesingVersion>();

export const UserOngoingChats = new Map<string, Set<string>>();
