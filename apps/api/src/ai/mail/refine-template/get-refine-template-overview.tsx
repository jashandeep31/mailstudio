import { googleGenAi } from "../../config.js";

export async function getRefineTemplateOverview(prompt: string) {
  const response = await googleGenAi.models.generateContentStream({
    model: "models/gemini-flash-latest",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
}

const SYSTEM_INSTRUCTION = `

you are professional prompt analyzer 
`;
