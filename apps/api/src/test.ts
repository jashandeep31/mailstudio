import { chatVersionOutputsTable, db } from "@repo/db";

export async function test() {
  console.log("Test is fired 🔥 up ");
  const [chatOutput] = await db.select().from(chatVersionOutputsTable).limit(1);
  if (!chatOutput) return;
  getClassesInjectedMJML(chatOutput.mjml_code);
}
// Generate a random class name
function generateRandomClass(): string {
  return "el-" + Math.random().toString(36).substring(2, 10);
}

export const getClassesInjectedMJML = (rawCode: string): string => {
  let result = rawCode.replace(
    /<(mj-[a-z-]+)(\s|>)/gi,
    (_match, tagName, after) => {
      const randomClass = generateRandomClass();
      if (after === ">") {
        return `<${tagName} css-class="custom-${randomClass}">`;
      }
      return `<${tagName} css-class="custom-${randomClass}" `;
    },
  );
  return result;
};
