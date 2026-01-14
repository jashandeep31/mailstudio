import axios from "axios";
import path from "path";
import fs from "fs";
import { ContentListUnion, createPartFromUri, File } from "@google/genai";
import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";

const GEMINI_MODEL = "models/gemini-3-pro-preview";
const FILE_PROCESSING_POLL_INTERVAL_MS = 5000;

interface CreateNewMailTemplateParams {
  prompt: string;
  brandKitId: string | null;
  mediaUrls: string[];
}

interface UploadedFile {
  uri: string;
  mimeType: string;
}

export const createNewMailTemplate = async ({
  prompt,
  mediaUrls,
}: CreateNewMailTemplateParams): Promise<string> => {
  const uploadedFiles = await uploadMediaFiles(mediaUrls);
  await waitForFilesProcessing(uploadedFiles);

  const validFiles = getValidFiles(uploadedFiles);
  const contentWithPrompt = buildContent(prompt, validFiles);

  const refinedPrompt = await refinePrompt(contentWithPrompt);
  const contentWithRefinedPrompt = buildContent(refinedPrompt, validFiles);

  return generateTemplate(contentWithRefinedPrompt);
};

const uploadMediaFiles = async (mediaUrls: string[]): Promise<File[]> => {
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

const waitForFilesProcessing = async (files: File[]): Promise<void> => {
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

const getValidFiles = (files: File[]): UploadedFile[] =>
  files
    .filter((file): file is File & { uri: string; mimeType: string } =>
      Boolean(file.uri && file.mimeType),
    )
    .map(({ uri, mimeType }) => ({ uri, mimeType }));

const buildContent = (
  textContent: string,
  files: UploadedFile[],
): ContentListUnion => {
  const content: ContentListUnion = [textContent];

  for (const { uri, mimeType } of files) {
    content.push(createPartFromUri(uri, mimeType));
  }

  return content;
};

const refinePrompt = async (content: ContentListUnion): Promise<string> => {
  const response = await googleGenAi.models.generateContent({
    model: GEMINI_MODEL,
    contents: content,
    config: {
      systemInstruction: prompts["system.newTemplate.properPrompt"](),
    },
  });

  const refinedPrompt = response.text!;
  fs.writeFileSync("prompt.txt", refinedPrompt);

  return refinedPrompt;
};

const generateTemplate = async (content: ContentListUnion): Promise<string> => {
  const response = await googleGenAi.models.generateContent({
    model: GEMINI_MODEL,
    contents: content,
    config: {
      systemInstruction: prompts["system.newTemplate.generation"](),
    },
  });

  return response.text!;
};
