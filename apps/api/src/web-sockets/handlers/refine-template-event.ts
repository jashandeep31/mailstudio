import {
  chatVersionsTable,
  db,
  eq,
  count,
  chatVersionPromptsTable,
  chatVersionOutputsTable,
  brandKitsTable,
} from "@repo/db";
import { validateMediaIds } from "./handle-question-event.js";
import { SocketEventSchemas } from "@repo/shared";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { refineMailTemplate } from "../../ai/mail/refine-template/index.js";
import mjml2html from "mjml";
import { WebSocket } from "ws";
import { getRefineTemplateOverview } from "../../ai/mail/refine-template/get-refine-template-overview.js";
import { streamOverview } from "../functions/stream-overview.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import { updateUserInstructions } from "../../ai/mail/user-instructions.js";
import { updateUserCreditWallet } from "../functions/common.js";
import { addToThumbnailUpdateQueue } from "../../queues/thumbnail-update-queue.js";
import { getCachedBrandKit } from "../../lib/redis/brand-kit-cache.ts.js";

interface RefineTemplateHandler {
  data: z.infer<(typeof SocketEventSchemas)["event:refine-template-message"]>;
  socket: WebSocket;
}

export const refineTemplateHandler = async ({
  data,
  socket,
}: RefineTemplateHandler) => {
  // TODO: please store the version temp in the redis so that when user referesh can be sent to the user
  const versionId = uuid();
  const questionId = uuid();

  // Getting the brandkit and sending it to refine template maker ai function
  let brandKit: null | typeof brandKitsTable.$inferSelect = null;
  if (data.brandKitId) {
    brandKit = await getCachedBrandKit(data.brandKitId, socket.userId);
  }
  const validMedia = await validateMediaIds(data.media, socket.userId);
  const mediaUrls = validMedia.map((media) => media.exact_url);
  const [prevOutput] = await db
    .select()
    .from(chatVersionOutputsTable)
    .where(eq(chatVersionOutputsTable.version_id, data.prevVersionId));
  const [preVersionsCount] = await db
    .select({
      count: count(),
    })
    .from(chatVersionsTable)
    .where(eq(chatVersionsTable.chat_id, data.chatId));

  const DummyVersion: typeof chatVersionsTable.$inferSelect = {
    id: versionId,
    chat_id: data.chatId,
    user_id: socket.userId,
    version_number: preVersionsCount ? preVersionsCount.count + 1 : 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const DummyQuestion: typeof chatVersionPromptsTable.$inferSelect = {
    id: questionId,
    version_id: versionId,
    prompt: data.message,
    brand_kit_id: null,
    created_at: new Date(),
  };

  socket.send(
    JSON.stringify({
      key: "res:new-version",
      data: {
        chat_versions: DummyVersion,
        chat_version_prompts: DummyQuestion,
        chat_version_outputs: null,
      },
    }),
  );

  const [refinedMJMLResponse, overviewRes, updatedInstructions] =
    await Promise.all([
      refineMailTemplate({
        prevMjmlCode: prevOutput?.mjml_code || "",
        prompt: data.message,
        instructions: prevOutput?.generation_instructions || "",
        mediaUrls: mediaUrls,
        brandKit: null,
      }),

      //streaming the overview
      streamOverview({
        chatId: data.chatId,
        chatQuestion: DummyQuestion,
        version: DummyVersion,
        generator: getRefineTemplateOverview,
        socket: socket,
        addCurrentSocket: true,
      }),
      updateUserInstructions(
        data.message,
        prevOutput?.generation_instructions || "",
      ),
    ]);

  const html_code = mjml2html(refinedMJMLResponse.outputText);

  const { chatVersion, chatQuestion, chatOutput } = await db.transaction(
    async (tx) => {
      const [chatVersion] = await tx
        .insert(chatVersionsTable)
        .values(DummyVersion)
        .returning();

      if (!chatVersion) throw new Error("failed to create the chat version");

      const [chatQuestion] = await tx
        .insert(chatVersionPromptsTable)
        .values(DummyQuestion)
        .returning();

      const [chatOutput] = await tx
        .insert(chatVersionOutputsTable)
        .values({
          version_id: chatVersion.id,
          overview: overviewRes.outputText,
          mjml_code: refinedMJMLResponse.outputText,
          html_code: html_code.html,
          generation_instructions: updatedInstructions,
        })
        .returning();

      return { chatVersion, chatQuestion, chatOutput };
    },
  );

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
            chat_version_outputs: chatOutput,
          },
        }),
      );
    }
  }
  // updating the thumbnail of the refine-template
  addToThumbnailUpdateQueue(data.chatId);
  ProcesingVersions.delete(`${socket.userId}::${chatVersion.chat_id}`);
  const totalCost =
    refinedMJMLResponse.outputTokensCost +
    refinedMJMLResponse.inputTokensCost +
    overviewRes.outputTokensCost +
    overviewRes.inputTokesnCost;
  await updateUserCreditWallet({ socket, totalCost });
};
