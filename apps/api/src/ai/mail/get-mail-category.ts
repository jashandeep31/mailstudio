import { chatCategoriesTable, db } from "@repo/db";
import { googleGenAi } from "../config.js";
import { models } from "../models.js";

/**
 * Categorizes a user prompt into an email category.
 *
 * @param prompt - Raw user input text
 * @returns Category slug or null if no match found
 *
 * Rules:
 * - Only predefined slugs are allowed
 * - No explanations in output
 * - One word only
 */
export const getMailCategory = async (
  prompt: string,
): Promise<string | null> => {
  const categories = await db.select().from(chatCategoriesTable);
  const categoriesList = categories.map((category) => category.slug);
  const MODEL = models["gemini-3-flash-preview"];
  const res = await googleGenAi.models.generateContent({
    model: MODEL.name,
    contents: `
User input:
"${prompt}"
Task:
Determine the single most appropriate category for this input from the predefined list.
Rules:
- Return ONLY the category slug exactly as provided in the list.
- Return ONLY ONE word.
- If no category applies, return null.
- Do not explain your reasoning.
- Do not add extra text.
`,
    config: {
      systemInstruction: `
You are a strict email categorization engine.
You must classify user input into ONE of the following predefined category slugs.
If none match, return null.

Available categories:
${categoriesList.join(" ")}
`,
    },
  });

  const selectedCategory = categories.find(
    (cat) => cat.slug === res.text?.trim(),
  );

  return selectedCategory ? selectedCategory.id : null;
};
