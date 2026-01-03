import { chatVersionOutputsTable, chatVersionPromptsTable, db } from "@repo/db";
import { getQuestionOverview } from "../../ai/mail/get-question-overview.js";
import { ProcesingVersions } from "../../state/processing-versions-state.js";
import WebSocket from "ws";
import mjml2html from "mjml";
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
  const html_code = mjml2html(tempMjmlCode);
  await db.insert(chatVersionOutputsTable).values({
    version_id: chatQuestion.version_id,
    overview: currentStreamData.overviewOutput,
    mjml_code: tempMjmlCode,
    html_code: html_code.html,
  });
  ProcesingVersions.delete(key);
};


const tempMjmlCode = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>

        <mj-divider border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`
