import WebSocket from "ws";
import { getQuestionOverview } from "../../ai/mail/get-question-overview.js";

interface streamAndHandleQuestionOverview {
  chatId: string;
  questionId: string;
  question: string;
  socket: WebSocket;
}
export const streamAndHandleQuestionOverview = async ({
  chatId,
  questionId,
  question,
  socket,
}: streamAndHandleQuestionOverview) => {
  console.log(`howe`);
  for await (const value of getQuestionOverview(question)) {
    console.log(value);
    socket.send(
      JSON.stringify({
        key: `res:chat-overview-${chatId}}`,
        data: {
          id: questionId,
          value: value,
        },
      }),
    );
  }
};
