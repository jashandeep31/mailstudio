import { googleGenAi } from "../config.js";
import { prompts } from "../../prompts/index.js";

export async function* getTemplateName(prompt: string) {
  const systemInstruction = prompts["system.getTemplateName"]();
  const response = await googleGenAi.models.generateContentStream({
    model: "models/gemini-flash-latest",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  for await (const chunk of response) {
    yield chunk.text;
  }
}
