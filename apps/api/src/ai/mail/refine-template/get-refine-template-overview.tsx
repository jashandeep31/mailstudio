import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";

export async function* getRefineTemplateOverview(prompt: string) {
  const systemInstruction = prompts["system.refineTemplate.overview"]();
  const response = await googleGenAi.models.generateContentStream({
    model: "models/gemini-flash-latest",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  let tempText = "";
  for await (const chunk of response) {
    if (!chunk.text) continue;
    tempText += chunk.text;
    yield { text: tempText, done: false };
  }
  yield { text: tempText, done: true };
}
