import { googleGenAi } from "../config.js";
import { prompts } from "../../prompts/index.js";

export async function* getQuestionOverview(prompt: string) {
  let enabled = true;
  if (enabled) {
    const systemInstruction = prompts["system.getQuestionOverview"]();
    const response = await googleGenAi.models.generateContentStream({
      model: "models/gemini-flash-latest",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    let tempText = "";
    for await (const chunk of response) {
      if (!chunk.text) continue; // ignore non-text parts
      tempText += chunk.text;
      yield { text: tempText, done: false };
    }
    yield { text: tempText, done: true };
  } else {
    let tempText = "";

    const systemInstruction = prompts["system.getQuestionOverview"]();
    for (const char of systemInstruction) {
      tempText += char;
      yield { text: tempText, done: false };
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1);
      });
    }
    yield { text: tempText, done: true };
  }
}
