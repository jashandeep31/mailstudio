import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";

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
  const response = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: userPrompt,
    config: {
      systemInstruction: prompts["system.refineTemplate.applyChanges"](),
    },
  });

  console.log(response.data);
  return response.text!;
};
const rewritePromptForDownstreamModel = async (userPrompt: string) => {
  const response = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: userPrompt,
    config: {
      systemInstruction: prompts["system.refineTemplate.rewrite"](),
    },
  });

  return response.text!;
};
