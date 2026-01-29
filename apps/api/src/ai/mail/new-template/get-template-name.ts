import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";

export async function getTemplateName(prompt: string): Promise<string> {
  const systemInstruction = prompts["system.getTemplateName"]();
  const response = await googleGenAi.models.generateContent({
    model: "models/gemini-flash-latest",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  return response.text!;
}
