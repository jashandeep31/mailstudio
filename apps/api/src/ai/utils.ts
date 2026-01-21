import { GenerateContentResponse, Tokens } from "@google/genai";
import { AiFunctionResponse, StreamingAiFunctionResponse } from "./types.js";
import { brandKitsTable } from "@repo/db";

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

export const getBrankitInAIFormatedWay = (
  brandKit: typeof brandKitsTable.$inferSelect,
): string => {
  const cleanBrandKit = removeNullishOrUndefined(brandKit);
  let finalOutput = `Here is the brand data for which the user is creating a mail template please use this given data links suppose may its of website, logo, and social media links etc to ry match teh brand identity  using its colors and data if not provided then you can assume those values:`;

  for (const [key, value] of Object.entries(cleanBrandKit)) {
    finalOutput += `\n${key}: ${value}`;
  }

  return finalOutput;
};
const removeNullishOrUndefined = (obj: any) => {
  const otherRemoveAbleKeys = ["id", "created_at", "updated_at", "user_id"];
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) =>
        v !== null && v !== undefined && !otherRemoveAbleKeys.includes(k),
    ),
  );
};
