import fs from "fs";
import { ContentListUnion } from "@google/genai";
import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";
import {
  uploadMediaFiles,
  waitForFilesProcessing,
  getValidFiles,
} from "../utils/file-upload.js";
import { buildContent } from "../utils/content-builder.js";
import { retryWithDelay } from "../utils/retry.js";

const GEMINI_MODEL = "models/gemini-3-pro-preview";

interface CreateNewMailTemplateParams {
  prompt: string;
  brandKitId: string | null;
  mediaUrls: string[];
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

const refinePrompt = async (content: ContentListUnion): Promise<string> => {
  console.log("Refining prompt...");
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: GEMINI_MODEL,
      contents: content,
      config: {
        systemInstruction: prompts["system.newTemplate.properPrompt"](),
      },
    }),
  );

  return response.text!;
};

const generateTemplate = async (content: ContentListUnion): Promise<string> => {
  console.log("Generating template...");
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: GEMINI_MODEL,
      contents: content,
      config: {
        systemInstruction: prompts["system.newTemplate.generation"](),
      },
    }),
  );
  return response.text!;
};
