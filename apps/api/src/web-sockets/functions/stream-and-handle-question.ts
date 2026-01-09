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
import { streamOverview } from "./stream-overview.js";

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
    await streamOverview({
      generator: getQuestionOverview,
      socket,
      chatQuestion,
      version: chatVersion,
      chatId,
      addCurrentSocket: false,
    }),
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
  const processingVersion = ProcesingVersions.get(
    `${socket.userId}::${chatVersion.chat_id}`,
  );
  if (processingVersion) {
    for (const localSocket of processingVersion.sockets) {
      localSocket.send(
        JSON.stringify({
          key: "res:version-update",
          data: {
            chat_versions: chatVersion,
            chat_version_prompts: chatQuestion,
            chat_version_outputs: chatVersionOutput,
          },
        }),
      );
    }
  }
  ProcesingVersions.delete(`${socket.userId}::${chatId}`);
};
