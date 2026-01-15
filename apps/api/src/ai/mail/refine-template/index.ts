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

interface RefineMailTemplate {
  prompt: string;
  instructions?: string;
  brandKit: string | null;
  mediaUrls: string[];
  prevMjmlCode: string;
}

export const refineMailTemplate = async ({
  prompt,
  instructions,
  mediaUrls,
  prevMjmlCode,
}: RefineMailTemplate): Promise<string> => {
  const uploadedFiles = await uploadMediaFiles(mediaUrls);
  await waitForFilesProcessing(uploadedFiles);

  const validFiles = getValidFiles(uploadedFiles);
  const contentWithPrompt = buildContent(
    `
NEW USER INPUT:
${prompt}

EXISTING USER INSTRUCTIONS:
${instructions}

TASK:
Update the existing instructions based strictly on the new user input.
Preserve all preferences that are not explicitly changed.
Return only the updated instructions as a single paragraph.
`,
    validFiles,
  );

  const properPrompt = await rewritePromptForDownstreamModel(contentWithPrompt);
  const refinedContent = buildContent(
    properPrompt + "\n\n" + prevMjmlCode,
    validFiles,
  );

  const refinedMJMLTemplate = await generateRefinedMjmlCode(refinedContent);
  return refinedMJMLTemplate;
};

const generateRefinedMjmlCode = async (content: ContentListUnion) => {
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: GEMINI_MODEL,
      contents: content,
      config: {
        systemInstruction: prompts["system.refineTemplate.applyChanges"](),
      },
    }),
  );

  return response.text!;
};

const rewritePromptForDownstreamModel = async (content: ContentListUnion) => {
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: GEMINI_MODEL,
      contents: content,
      config: {
        systemInstruction: prompts["system.refineTemplate.rewrite"](),
      },
    }),
  );

  return response.text!;
};
