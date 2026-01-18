import { GenerateContentResponse, Tokens } from "@google/genai";
import { StreamingAiFunctionResponse } from "./types.js";

export const parseChunkStreamingChunkGemini = (
  prevText: string,
  done: boolean,
  chunk: GenerateContentResponse,
  getInputTokensPrice: (tokensCount: number) => number,
  getOutputTokensPrice: (tokensCount: number) => number,
): StreamingAiFunctionResponse => {
  // getting the total consumed tokens
  const outputTokensCount =
    (chunk.usageMetadata?.candidatesTokenCount ?? 0) +
    (chunk.usageMetadata?.thoughtsTokenCount ?? 0);

  //getting the total input consumed tokens
  const inputTokensCount = chunk.usageMetadata?.promptTokenCount ?? 0;

  return {
    output: {
      text: prevText + (chunk.text ?? ""),
      done,
    },
    outputTokensCost: getOutputTokensPrice(outputTokensCount),
    inputTokensCost: getInputTokensPrice(inputTokensCount),
  };
};
