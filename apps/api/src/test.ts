import { googleGenAi } from "./ai/config.js";

export async function test() {
  console.log("Test is fired 🔥 up ");
  // try {
  //   const res = await googleGenAi.models.generateContent({
  //     model: "gemini-3-pro-preview",
  //     contents: [{ text: "How to write the professional email" }],
  //     config: {
  //       systemInstruction: "You are a professional email writer1",
  //     },
  //   });
  //   console.log(res);
  // } catch (e) {
  //   console.log(e);
  // }

  // getMailCategory(`Create the mail template for the user email verification`);
  // const categoriesList = [
  //   "authentication",
  //   "account",
  //   "billing",
  //   "marketing",
  //   "notification",
  //   "support",
  // ];
  //
  // for (const category of categoriesList) {
  //   console.log(category);
  //   await db.insert(chatCategoriesTable).values({
  //     name: category,
  //     slug: slugify.default(category),
  //   });
  // }
}
