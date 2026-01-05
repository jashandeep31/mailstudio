import { googleGenAi } from "../../config.js";

interface RefineMailTemplate {
  prompt: string;
  brandKit: string | null;
  media: string[];
  prevMjmlCode: string;
}
export const refineMailTemplate = async ({
  prompt,
  brandKit,
  media,
  prevMjmlCode,
}: RefineMailTemplate): Promise<string> => {
  const properPrompt = await rewritePromptForDownstreamModel(prompt);
  const refinedMJMLTemplate = await generateRefinedMjmlCode(
    properPrompt + prevMjmlCode,
  );
  return refinedMJMLTemplate;
};

const generateRefinedMjmlCode = async (userPrompt: string) => {
  const SYSTEM_INSTRUCTION = `
You are a professional MJML email template developer.

The user provides:
- An existing MJML email template
- A list of requested changes

Your task:
- Apply the requested changes correctly to the MJML template
- Modify only what is required
- Keep the structure valid MJML
- Return ONLY the final MJML code
- Do NOT add explanations or extra text
`;

  const response = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text!;
};
const rewritePromptForDownstreamModel = async (userPrompt: string) => {
  const SYSTEM_INSTRUCTION = `
You are a professional prompt writer.
The user provides MJML email template code and requested changes.

Your task:
- Analyze the MJML code
- Rewrite the user's request into very explicit, step-by-step instructions
- Mention exactly WHERE (sections / lines / components) changes must be applied
- Describe WHAT to add, remove, or modify
- Be extremely clear so a weaker AI model can follow the instructions perfectly
`;

  const response = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return response.text!;
};
