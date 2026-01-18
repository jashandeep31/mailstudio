import { GenerateContentResponse, Tokens } from "@google/genai";
import { AiFunctionResponse, StreamingAiFunctionResponse } from "./types.js";

/**
 * Function return the response after parsing the data;
 * @returns outputtext, outputTokensCost , inputTokensCost
 */
export const parseAiFunctionResponse = (
  response: GenerateContentResponse,
  getInputTokensPrice: (tokensCount: number) => number,
  getOutputTokensPrice: (tokensCount: number) => number,
): AiFunctionResponse => {
  const outputTokensCount =
    (response.usageMetadata?.candidatesTokenCount ?? 0) +
    (response.usageMetadata?.thoughtsTokenCount ?? 0);
  const inputTokensCount = response.usageMetadata?.promptTokenCount ?? 0;
  return {
    outputText: response.text!,
    outputTokensCost: getOutputTokensPrice(outputTokensCount),
    inputTokensCost: getInputTokensPrice(inputTokensCount),
  };
};

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
