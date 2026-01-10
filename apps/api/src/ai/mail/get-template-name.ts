import { googleGenAi } from "../config.js";

export async function* getTemplateName(prompt: string) {
  const response = await googleGenAi.models.generateContentStream({
    model: "models/gemini-flash-latest",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  for await (const chunk of response) {
    yield chunk.text;
  }
}

const SYSTEM_INSTRUCTION = `You are a proffsional name retuner you have passed a prompt of user to design a speicfic email mjml template. so you have to return only the name in the 2 3 words max.`;
