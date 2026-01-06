import {
  chatVersionsTable,
  db,
  eq,
  count,
  chatVersionPromptsTable,
  chatVersionOutputsTable,
} from "@repo/db";
import { SocketEventSchemas } from "@repo/shared";
import z from "zod";
import { v4 as uuid } from "uuid";
import { refineMailTemplate } from "../../ai/mail/refine-template/index.js";
import mjml2html from "mjml";
import { WebSocket } from "ws";

interface RefineTemplateHandler {
  data: z.infer<(typeof SocketEventSchemas)["event:refine-template-message"]>;
  socket: WebSocket;
}

export const refineTemplateHandler = async ({
  data,
  socket,
}: RefineTemplateHandler) => {
  const versionId = uuid();
  const questionId = uuid();

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
        chat_version_outputs: {},
      },
    }),
  );

  const [refinedMJMLResponse] = await Promise.all([
    await refineMailTemplate({
      prevMjmlCode: prevOutput?.mjml_code || "",
      prompt: data.message,
      media: data.media,
      brandKit: null,
    }),
  ]);

  const html_code = mjml2html(refinedMJMLResponse);

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
          overview: "overview is needed to be updated",
          mjml_code: refinedMJMLResponse,
          html_code: html_code.html,
        })
        .returning();

      return { chatVersion, chatQuestion, chatOutput };
    },
  );

  socket.send(
    JSON.stringify({
      key: "res:version-update",
      data: {
        chat_versions: chatVersion,
        chat_version_prompts: chatQuestion,
        chat_version_outputs: chatOutput,
      },
    }),
  );
};
