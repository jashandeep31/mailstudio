import { WebSocket } from "ws";

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
