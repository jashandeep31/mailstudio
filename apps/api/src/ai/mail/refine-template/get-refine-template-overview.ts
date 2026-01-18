import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";
import { StreamingAiFunctionResponse } from "../../types.js";
import { parseChunkStreamingChunkGemini } from "../../utils.js";
import { models } from "../../models.js";

export async function* getRefineTemplateOverview(
  prompt: string,
): AsyncGenerator<StreamingAiFunctionResponse> {
  const MODEL = models["gemini-3-flash-preview"];
  const systemInstruction = prompts["system.refineTemplate.overview"]();
  const response = await googleGenAi.models.generateContentStream({
    model: "models/gemini-flash-latest",
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
  // let tempText = "";
  // for await (const chunk of response) {
  //   if (!chunk.text) continue;
  //   tempText += chunk.text;
  //   yield { text: tempText, done: false };
  // }
  // yield { text: tempText, done: true };
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
