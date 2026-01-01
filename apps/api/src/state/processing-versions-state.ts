// on the basis ov

import { WebSocket } from "ws";

// userid::chatid
interface ProcesingVersion {
  chatId: string;
  questionId: string;
  overviewOutput: string;
  isDone: boolean;
  sockets: Set<WebSocket>;
  abortController: AbortController;
}
export const ProcesingVersions = new Map<string, ProcesingVersion>();
