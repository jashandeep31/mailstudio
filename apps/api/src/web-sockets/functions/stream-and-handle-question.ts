import {
  chatMediaTable,
  chatsTable,
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  eq,
} from "@repo/db";
import { getQuestionOverview } from "../../ai/mail/get-question-overview.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import WebSocket from "ws";
import mjml2html from "mjml";
import { createNewMailTemplate } from "../../ai/mail/new-template/index.js";
import { streamOverview } from "./stream-overview.js";
import { getTemplateName } from "../../ai/mail/get-template-name.js";
import { createUserInstructions } from "../../ai/mail/user-instructions.js";
import { totalmem } from "os";
import { AwsClient } from "google-auth-library";
import { updateUserCreditWallet } from "./common.js";

interface StreamAndHandleQuestion {
  chatQuestion: typeof chatVersionPromptsTable.$inferSelect;
  chatMedia: (typeof chatMediaTable.$inferSelect)[];
  chatId: string;
  chatVersion: typeof chatVersionsTable.$inferSelect;
  socket: WebSocket;
  type: "old" | "new";
}

export const streamAndHandleQuestion = async ({
  chatQuestion,
  chatId,
  socket,
  chatMedia,
  type,
  chatVersion,
}: StreamAndHandleQuestion) => {
  const [overviewRes, mjmlAiRes, _, instructions] = await Promise.all([
    streamOverview({
      generator: getQuestionOverview,
      socket,
      chatQuestion,
      version: chatVersion,
      chatId,
      addCurrentSocket: false,
    }),
    createNewMailTemplate({
      prompt: chatQuestion.prompt,
      brandKitId: null,
      mediaUrls: chatMedia.map((media) => media.storage_path),
    }),
    streamTemplateName(
      chatQuestion.prompt,
      socket,
      chatId,
      chatVersion.chat_id,
    ),
    createUserInstructions(chatQuestion.prompt),
  ]);

  const html_code = mjml2html(mjmlAiRes.outputText);
  /*
   * Saving to the database
   */
  const [chatVersionOutput] = await db
    .insert(chatVersionOutputsTable)
    .values({
      version_id: chatQuestion.version_id,
      overview: overviewRes.outputText,
      mjml_code: mjmlAiRes.outputText,
      html_code: html_code.html,
      generation_instructions: instructions,
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

  const totalCost =
    overviewRes.outputTokensCost +
    overviewRes.inputTokesnCost +
    mjmlAiRes.outputTokensCost +
    mjmlAiRes.inputTokensCost;
  await updateUserCreditWallet({ socket, totalCost });
};

const streamTemplateName = async (
  prompt: string,
  socket: WebSocket,
  chatId: string,
  chatDbId: string,
) => {
  let name = "";
  for await (const chunk of getTemplateName(prompt)) {
    name += chunk;
  }
  // Update DB immediately when name is ready, don't wait for other operations
  db.update(chatsTable)
    .set({ name })
    .where(eq(chatsTable.id, chatDbId))
    .then(() => {})
    .catch(console.error);
};
