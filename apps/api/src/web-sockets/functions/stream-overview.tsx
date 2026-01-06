import { chatVersionPromptsTable, chatVersionsTable } from "@repo/db";
import WebSocket from "ws";
import { ProcesingVersions } from "../../state/processing-versions-state.js";

interface streamOverview {
  chatId: string;
  version: typeof chatVersionsTable.$inferSelect;
  chatQuestion: typeof chatVersionPromptsTable.$inferSelect;
  socket: WebSocket;
  generator: (prompt: string) => AsyncGenerator<
    {
      text: string;
      done: boolean;
    },
    void,
    unknown
  >;
  addCurrentSocket: boolean;
}
export const streamOverview = async ({
  generator,
  socket,
  chatQuestion,
  version,
  chatId,
  addCurrentSocket,
}: streamOverview): Promise<string> => {
  const ProcesingVersionKey = `${socket.userId}::${chatId}`;

  const streamDataTemplate = {
    chatId,
    questionId: chatQuestion.id,
    overviewOutput: "",
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
        response: "",
      },
    }),
  );

  ProcesingVersions.set(ProcesingVersionKey, streamDataTemplate);

  // TODO: in future make sure to only send the chunks to the user to redue the payload size
  for await (const chunk of generator(chatQuestion.prompt)) {
    // updating the ovview in the template
    streamDataTemplate.overviewOutput = chunk.text || "";
    for (const socket of streamDataTemplate.sockets) {
      socket.send(
        JSON.stringify({
          key: "res:stream-answer",
          data: {
            versionId: version.id,
            chatId: chatId,
            questionId: chatQuestion.id,
            response: chunk.text,
          },
        }),
      );
    }
  }

  // updating the state of the processing version
  streamDataTemplate.isDone = true;
  ProcesingVersions.delete(ProcesingVersionKey);
  return streamDataTemplate.overviewOutput;
};
