import fs from "fs";
import { ContentListUnion } from "@google/genai";
import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";
import {
  uploadMediaFiles,
  waitForFilesProcessing,
  getValidFiles,
  buildContent,
} from "../utils/index.js";

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
  const response = await googleGenAi.models.generateContentStream({
    model: GEMINI_MODEL,
    contents: content,
    config: {
      systemInstruction: prompts["system.newTemplate.generation"](),
    },
  });
  let code = ``;
  for await (const chunk of response) {
    code += chunk.text;
    console.log(chunk.text);
  }

  return code;
};
