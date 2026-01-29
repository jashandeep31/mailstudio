import {
  GenerateContentResponse,
  Tokens,
  File,
  ContentListUnion,
  createPartFromUri,
} from "@google/genai";
import { AiFunctionResponse, StreamingAiFunctionResponse } from "./types.js";
import { brandKitsTable } from "@repo/db";
import axios from "axios";
import path from "path";
import { googleGenAi } from "./config.js";

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

// ============ File Upload Utilities ============

const FILE_PROCESSING_POLL_INTERVAL_MS = 5000;

export interface UploadedFile {
  uri: string;
  mimeType: string;
}

export const uploadMediaFiles = async (
  mediaUrls: string[],
): Promise<File[]> => {
  const uploadPromises = mediaUrls.map(uploadSingleFile);
  return Promise.all(uploadPromises);
};

const uploadSingleFile = async (mediaUrl: string): Promise<File> => {
  const response = await axios.get(mediaUrl, { responseType: "arraybuffer" });

  const buffer = Buffer.from(response.data);
  const mimeType = response.headers["content-type"] || "image/png";
  const blob = new Blob([buffer], { type: mimeType });
  const fileName = path.basename(new URL(mediaUrl).pathname) || "media-file";

  return googleGenAi.files.upload({
    file: blob,
    config: { displayName: fileName, mimeType },
  });
};

export const waitForFilesProcessing = async (files: File[]): Promise<void> => {
  await Promise.all(files.map(waitForSingleFileProcessing));
};

const waitForSingleFileProcessing = async (file: File): Promise<void> => {
  let fileStatus = await googleGenAi.files.get({ name: file.name as string });

  while (fileStatus.state === "PROCESSING") {
    await delay(FILE_PROCESSING_POLL_INTERVAL_MS);
    fileStatus = await googleGenAi.files.get({ name: file.name as string });
  }
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getValidFiles = (files: File[]): UploadedFile[] =>
  files
    .filter((file): file is File & { uri: string; mimeType: string } =>
      Boolean(file.uri && file.mimeType),
    )
    .map(({ uri, mimeType }) => ({ uri, mimeType }));

// ============ Content Builder Utilities ============

export const buildContent = (
  textContent: string,
  files: UploadedFile[],
): ContentListUnion => {
  const content: ContentListUnion = [textContent];
  //
  // for (const { uri, mimeType } of files) {
  //   content.push(createPartFromUri(uri, mimeType));
  // }

  return content;
};
