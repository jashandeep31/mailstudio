import { getQuestionOverview } from "../../ai/mail/get-question-overview.js";

interface streamAndHandleQuestionOverview {
  chatId: string;
  questionId: string;
  question: string;
}
export const streamAndHandleQuestionOverview = async ({
  chatId,
  questionId,
  question,
}: streamAndHandleQuestionOverview) => {
  for await (const value of getQuestionOverview(question)) {
    console.log(value);
  }
};
