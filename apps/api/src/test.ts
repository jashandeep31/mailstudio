import { googleGenAi } from "./ai/config.js";
import { models } from "./ai/models.js";

export async function test() {
  console.log("Test is fired 🔥 up ");

  //testing hte ai
  // const res = await googleGenAi.models.generateContent({
  //   model: models["gemini-3-pro-preview"].name,
  //   contents: "write hte 50 on the neovim",
  // });
  // console.log(res.text);

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
