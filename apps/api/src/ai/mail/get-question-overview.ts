import { googleGenAi } from "../config.js";
import { prompts } from "../../prompts/index.js";
import { StreamingAiFunctionResponse } from "../types.js";
import { parseChunkStreamingChunkGemini } from "../utils.js";
import { models } from "../models.js";

export async function* getQuestionOverview(
  prompt: string,
): AsyncGenerator<StreamingAiFunctionResponse> {
  const systemInstruction = prompts["system.getQuestionOverview"]();
  const MODEL = models["gemini-3-flash-preview"];
  const response = await googleGenAi.models.generateContentStream({
    model: MODEL.name,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  let accumulatedText = "";
  let inputTokensCost = 0;
  let outputTokensCost = 0;
  for await (const chunk of response) {
    const res = parseChunkStreamingChunkGemini(
      accumulatedText,
      false,
      chunk,
      MODEL.getInputTokensPrice,
      MODEL.getOutputTokensPrice,
    );
    accumulatedText += res.output.text;
    inputTokensCost = res.outputTokensCost;
    outputTokensCost = res.outputTokensCost;
    yield res;
  }

  yield {
    output: { text: accumulatedText, done: true },
    inputTokensCost,
    outputTokensCost,
  };
}
