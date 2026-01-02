import { chatVersionOutputsTable, chatVersionPromptsTable, db } from "@repo/db";
import { getQuestionOverview } from "../../ai/mail/get-question-overview.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import WebSocket from "ws";
interface StreamAndHandleQuestion {
  chatQuestion: typeof chatVersionPromptsTable.$inferSelect;
  chatId: string;
  socket: WebSocket;
}

export const streamAndHandleQuestion = async ({
  chatQuestion,
  chatId,
  socket,
}: StreamAndHandleQuestion) => {
  const key = `${socket.userId}::${chatId}`;
  if (ProcesingVersions.has(key)) return;

  const currentStreamData = {
    chatId,
    questionId: chatQuestion.id,
    overviewOutput: "",
    isDone: false,
    sockets: new Set<WebSocket>(),
    abortController: new AbortController(),
  };
  socket.send(
    JSON.stringify({
      key: "res:stream-answer",
      data: {
        versionId: chatQuestion.version_id,
        chatId: chatId,
        questionId: chatQuestion.id,
        response: "",
      },
    }),
  );
  ProcesingVersions.set(key, currentStreamData);
  for await (const chunk of getQuestionOverview(chatQuestion.prompt)) {
    currentStreamData.overviewOutput = chunk.text || "";
    for (const socket of currentStreamData.sockets) {
      if (socket.readyState === socket.OPEN) {
        socket.send(
          JSON.stringify({
            key: "res:stream-answer",
            data: {
              versionId: chatQuestion.version_id,
              chatId: chatId,
              questionId: chatQuestion.id,
              response: chunk.text,
            },
          }),
        );
      }
    }
  }
  currentStreamData.isDone = true;

  await db.insert(chatVersionOutputsTable).values({
    version_id: chatQuestion.version_id,
    overview: currentStreamData.overviewOutput,
    output_code: currentStreamData.overviewOutput,
  });
  ProcesingVersions.delete(key);
};
