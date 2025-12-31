// import WebSocket from "ws";
// import { getQuestionOverview } from "../../ai/mail/get-question-overview.js";
// import { ChatRoom } from "../chat-room.js";

import { ChatRoom } from "../chat-room.js";

// interface streamAndHandleQuestionOverview {
//   chatId: string;
//   questionId: string;
//   question: string;
//   socket: WebSocket;
// }
// export const streamAndHandleQuestionOverview = async ({
//   chatId,
//   questionId,
//   question,
//   socket,
// }: streamAndHandleQuestionOverview) => {
//   const abortController = new AbortController();
//   ChatRoom.set(chatId, {
//     ChatId: chatId,
//     streaming: true,
//     streamingQuestionId: questionId,
//     onHold: false,
//     leftOn: new Date(),
//     isUserConnected: false,
//   });
//   let str2 = "";
//   const string = `l Studio
//   create the mail template for user to verify the mail by clicking the button below he has the new signup on our platform. If he doesn't done it then don't perform any action we willa uto delete on the no verificationWorking.. I'll create a login page inspired by the Apollo.io design you shared. Let me first understand your codebase structure, then build the login page component.`;

//   const chatRoom = ChatRoom.get(chatId);
//   if (!chatRoom) return;
//   ChatRoom.set(chatId, {
//     ...chatRoom,
//     abortController,
//   });
//   for (const char of string) {
//     await new Promise((resolve) => setTimeout(resolve, 10));
//     str2 += char;
//     socket.send(
//       JSON.stringify({
//         key: "res:stream-answer",
//         data: {
//           versionId: "82c0a77e-bfa6-4349-b5d7-03bb7d7aa875",
//           chatId: "ec596619-1b42-47ed-8ea0-3876e194fdbf",
//           questionId: "56b2b3ce-3912-4a2f-acec-9b0d573221bb",
//           response: str2,
//         },
//       }),
//     );
//   }
//   // console.log(`howe`);
//   // for await (const value of getQuestionOverview(question)) {
//   //   console.log(value);
//   //   socket.send(
//   //     JSON.stringify({
//   //       key: `res:chat-overview-${chatId}}`,
//   //       data: {
//   //         id: questionId,
//   //         value: value,
//   //       },
//   //     }),
//   //   );
//   // }
// };

const startStream = ({
  chatId,
  socket,
  questionId,
  question,
}: {
  chatId: string;
  socket: WebSocket;
  questionId: string;
  question: string;
}) => {
  const session = ChatRoom.get(chatId);
  if (!session) return;

  // Abort old stream if any
  session.abortController?.abort();

  const abortController = new AbortController();

  ChatRoom.set(chatId, {
    ...session,
    abortController,
    pendingStream: null,
  });

  streamAndHandleQuestionOverview({
    chatId,
    questionId,
    question,
    socket,
    abortController,
  });
};

export const streamAndHandleQuestionOverview = async ({
  chatId,
  questionId,
  question,
  socket,
  abortController,
}: {
  chatId: string;
  questionId: string;
  question: string;
  socket: WebSocket;
  abortController: AbortController;
}) => {
  let response =
    "jzklfjakls ;jfkl;as jdklfja sklfjdals jfdaklsj kl;afjldks;a jfkl;dsj kl;j aklsj dklsaj fklajskl;rfdjlasfjkls;djakls; jlk;jsl;af";

  for (const char of question) {
    if (abortController.signal.aborted) break;

    await new Promise((r) => setTimeout(r, 10));

    response += char;

    socket.send(
      JSON.stringify({
        key: "res:stream-answer",
        data: {
          chatId,
          questionId,
          response,
        },
      }),
    );
  }
};
