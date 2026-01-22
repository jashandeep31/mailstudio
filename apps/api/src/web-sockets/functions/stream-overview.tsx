import { chatVersionPromptsTable, chatVersionsTable } from "@repo/db";
import WebSocket from "ws";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import { StreamingAiFunctionResponse } from "../../ai/types.js";

interface streamOverview {
  chatId: string;
  version: typeof chatVersionsTable.$inferSelect;
  chatQuestion: typeof chatVersionPromptsTable.$inferSelect;
  socket: WebSocket;
  generator: (
    prompt: string,
  ) => AsyncGenerator<StreamingAiFunctionResponse, void, unknown>;
  addCurrentSocket: boolean;
}

type streamOverviewOutput = Promise<{
  outputText: string;
  outputTokensCost: number;
  inputTokesnCost: number;
}>;

export const streamOverview = async ({
  generator,
  socket,
  chatQuestion,
  version,
  chatId,
  addCurrentSocket,
}: streamOverview): streamOverviewOutput => {
  const ProcesingVersionKey = `${chatId}`;
  const isProcessing = ProcesingVersions.get(ProcesingVersionKey);
  const streamDataTemplate = {
    chatId,
    questionId: chatQuestion.id,
    versionId: version.id,
    overviewOutput: isProcessing?.overviewOutput || "",
    isDone: false,
    sockets: new Set<WebSocket>(),
    abortController: new AbortController(),
  };
  if (addCurrentSocket) {
    streamDataTemplate.sockets.add(socket);
  }
  // sending the dummy first output to tell that streaming is //#region
  socket.send(
    JSON.stringify({
      key: "res:stream-answer",
      data: {
        versionId: version.id,
        chatId: chatId,
        questionId: chatQuestion.id,
        response: isProcessing?.overviewOutput || "",
      },
    }),
  );

  // Adding this the internal mapping system so that rejoin the user can get the data
  ProcesingVersions.set(ProcesingVersionKey, streamDataTemplate);
  let lastChunk: StreamingAiFunctionResponse | null = null;
  for await (const chunk of generator(chatQuestion.prompt)) {
    // updating the lastchunk and the  streamingTemplate output
    lastChunk = chunk;
    streamDataTemplate.overviewOutput = chunk.output.text || "";
    for (const socket of streamDataTemplate.sockets) {
      socket.send(
        JSON.stringify({
          key: "res:stream-answer",
          data: {
            versionId: version.id,
            chatId: chatId,
            questionId: chatQuestion.id,
            response: chunk.output.text,
          },
        }),
      );
    }
  }

  streamDataTemplate.isDone = true;
  return lastChunk
    ? {
        outputTokensCost: lastChunk.outputTokensCost,
        inputTokesnCost: lastChunk.inputTokensCost,
        outputText: lastChunk.output.text,
      }
    : {
        outputTokensCost: 0,
        inputTokesnCost: 0,
        outputText: "",
      };
};
