import { ContentListUnion } from "@google/genai";
import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";
import {
  uploadMediaFiles,
  waitForFilesProcessing,
  getValidFiles,
  buildContent,
  UploadedFile,
} from "../utils/index.js";

const GEMINI_MODEL = "models/gemini-3-pro-preview";

interface RefineMailTemplate {
  prompt: string;
  brandKit: string | null;
  mediaUrls: string[];
  prevMjmlCode: string;
}

export const refineMailTemplate = async ({
  prompt,
  mediaUrls,
  prevMjmlCode,
}: RefineMailTemplate): Promise<string> => {
  const uploadedFiles = await uploadMediaFiles(mediaUrls);
  await waitForFilesProcessing(uploadedFiles);

  const validFiles = getValidFiles(uploadedFiles);
  const contentWithPrompt = buildContent(prompt, validFiles);

  const properPrompt = await rewritePromptForDownstreamModel(contentWithPrompt);
  const refinedContent = buildContent(
    properPrompt + "\n\n" + prevMjmlCode,
    validFiles,
  );

  const refinedMJMLTemplate = await generateRefinedMjmlCode(refinedContent);
  return refinedMJMLTemplate;
};

const generateRefinedMjmlCode = async (content: ContentListUnion) => {
  const response = await googleGenAi.models.generateContent({
    model: GEMINI_MODEL,
    contents: content,
    config: {
      systemInstruction: prompts["system.refineTemplate.applyChanges"](),
    },
  });

  console.log(response.data);
  return response.text!;
};

const rewritePromptForDownstreamModel = async (content: ContentListUnion) => {
  const response = await googleGenAi.models.generateContent({
    model: GEMINI_MODEL,
    contents: content,
    config: {
      systemInstruction: prompts["system.refineTemplate.rewrite"](),
    },
  });

  return response.text!;
};
