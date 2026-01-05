import {
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
} from "@repo/db";
import { getQuestionOverview } from "../../ai/mail/get-question-overview.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import WebSocket from "ws";
import mjml2html from "mjml";
import { createNewMailTemplate } from "../../ai/mail/new-template/index.js";

interface StreamAndHandleQuestion {
  chatQuestion: typeof chatVersionPromptsTable.$inferSelect;
  chatId: string;
  chatVersion: typeof chatVersionsTable.$inferSelect;
  socket: WebSocket;
  type: "old" | "new";
}

export const streamAndHandleQuestion = async ({
  chatQuestion,
  chatId,
  socket,
  type,
  chatVersion,
}: StreamAndHandleQuestion) => {
  const [overview, mjml] = await Promise.all([
    await StreamOverview({ socket, chatId, chatQuestion, type, chatVersion }),
    await createNewMailTemplate({
      prompt: chatQuestion.prompt,
      brandKitId: null,
      media: [],
    }),
  ]);

  const html_code = mjml2html(mjml);
  /*
   * Saving to the database
   */
  const [chatVersionOutput] = await db
    .insert(chatVersionOutputsTable)
    .values({
      version_id: chatQuestion.version_id,
      overview: overview,
      mjml_code: mjml,
      html_code: html_code.html,
    })
    .returning();

  socket.send(
    JSON.stringify({
      key: "res:version-update",
      data: {
        chat_versions: chatVersion,
        chat_version_prompts: chatQuestion,
        chat_version_outputs: chatVersionOutput,
      },
    }),
  );
  ProcesingVersions.delete(`${socket.userId}::${chatId}`);
};

const StreamOverview = async ({
  socket,
  chatQuestion,
  chatId,
}: StreamAndHandleQuestion): Promise<string> => {
  const key = `${socket.userId}::${chatId}`;

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
  return currentStreamData.overviewOutput;
};
