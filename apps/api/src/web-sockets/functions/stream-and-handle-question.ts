import { chatVersionPromptsTable } from "@repo/db";
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
  ProcesingVersions.set(key, currentStreamData);
  // chunk= {text:"ai repsonse" , done boolean}
  for await (const chunk of getQuestionOverview(chatQuestion.prompt)) {
    // console.log(chunk);
    currentStreamData.overviewOutput = chunk.text || "";
    for (const socket of currentStreamData.sockets) {
      if (socket.readyState === socket.OPEN) {
        // console.log(`sokcet is senign the serusilt`);
        socket.send(
          JSON.stringify({
            key: "res:stream-answer",
            data: {
              chatId,
              overviewOutput: currentStreamData.overviewOutput,
            },
          }),
        );
      }
    }
  }
  currentStreamData.isDone = true;
  ProcesingVersions.delete(key);
};
