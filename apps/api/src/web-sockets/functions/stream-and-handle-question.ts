import {
  brandKitsTable,
  chatMediaTable,
  chatsTable,
  chatVersionOutputsTable,
  chatVersionPromptsTable,
  chatVersionsTable,
  db,
  eq,
} from "@repo/db";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import WebSocket from "ws";
import mjml2html from "mjml";
import { streamOverview } from "./stream-overview.js";
import { updateUserCreditWallet } from "./common.js";
import { addToThumbnailUpdateQueue } from "../../queues/thumbnail-update-queue.js";
import { getCachedBrandKit } from "../../lib/redis/brand-kit-cache.ts.js";
import { createUserInstructions } from "../../ai/mail/user-instructions/create-user-instructions.js";
import { createNewMailTemplate } from "../../ai/mail/new-template/index.js";
import { getQuestionOverview } from "../../ai/mail/new-template/get-question-overview.js";
import { getTemplateName } from "../../ai/mail/new-template/get-template-name.js";
import { getMailCategory } from "../../ai/mail/get-mail-category.js";
import { addUserOngoingChatAndEvent } from "../../lib/redis/user-ongoing-chats.js";

interface StreamAndHandleQuestion {
  chatQuestion: typeof chatVersionPromptsTable.$inferSelect;
  chatMedia: (typeof chatMediaTable.$inferSelect)[];
  chatId: string;
  chatVersion: typeof chatVersionsTable.$inferSelect;
  socket: WebSocket;
}

export const streamAndHandleQuestion = async ({
  chatQuestion,
  chatId,
  socket,
  chatMedia,
  chatVersion,
}: StreamAndHandleQuestion) => {
  let brandKit: null | typeof brandKitsTable.$inferSelect = null;
  if (chatQuestion.brand_kit_id) {
    brandKit = await getCachedBrandKit(
      chatQuestion.brand_kit_id,
      socket.userId,
    );
  }

  const [overviewRes, generatedTemplate, _, instructions] = await Promise.all([
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
      brandKit: brandKit,
      mediaUrls: chatMedia.map((media) => media.storage_path),
    }),
    getChatCategoryAndName(
      chatQuestion.prompt,
      socket,
      chatId,
      chatVersion.chat_id,
    ),
    createUserInstructions(chatQuestion.prompt),
  ]);

  const html_code = mjml2html(generatedTemplate.outputCode, {
    keepComments: false,
  });

  // Saving to the database
  const [chatVersionOutput] = await db
    .insert(chatVersionOutputsTable)
    .values({
      version_id: chatQuestion.version_id,
      overview: overviewRes.outputText,
      mjml_code: generatedTemplate.outputCode,
      html_code: html_code.html,
      generation_instructions: instructions,
    })
    .returning();
  const processingVersion = ProcesingVersions.get(`${chatVersion.chat_id}`);

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
  ProcesingVersions.delete(`${chatId}`);
  // updating the thumbnail of new-template
  await addToThumbnailUpdateQueue(chatId);
  const totalCost =
    overviewRes.outputTokensCost +
    overviewRes.inputTokesnCost +
    generatedTemplate.outputTokensCost +
    generatedTemplate.inputTokensCost;
  await updateUserCreditWallet({ socket, totalConsumedAmount: totalCost });
};
const getChatCategoryAndName = async (
  prompt: string,
  socket: WebSocket,
  chatId: string,
  chatDbId: string,
) => {
  // Adding the chat to the ongoing chats
  await addUserOngoingChatAndEvent({ userId: socket.userId, chatId, socket });

  let name = await getTemplateName(prompt);
  let categoryId = await getMailCategory(prompt);
  // Update DB immediately when name is ready, don't wait for other operations
  const updatingData: Record<string, string> = {};
  updatingData["name"] = name;
  if (categoryId) {
    updatingData["category_id"] = categoryId;
  }
  await db
    .update(chatsTable)
    .set({ ...updatingData })
    .where(eq(chatsTable.id, chatDbId))
    .then(() => {})
    .catch(console.error);
};
