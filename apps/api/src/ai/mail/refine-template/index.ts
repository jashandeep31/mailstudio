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
import { AiFunctionResponse } from "../../types.js";
import { parseAiFunctionResponse } from "../../utils.js";
import { models } from "../../models.js";

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
}: RefineMailTemplate): Promise<AiFunctionResponse> => {
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

  const refinedPromptRes =
    await rewritePromptForDownstreamModel(contentWithPrompt);
  const refinedContent = buildContent(
    refinedPromptRes.outputText + "\n\n" + prevMjmlCode,
    validFiles,
  );

  const refinedMJMLTemplateRes = await generateRefinedMjmlCode(refinedContent);
  return {
    outputText: refinedMJMLTemplateRes.outputText,
    inputTokensCost:
      refinedMJMLTemplateRes.inputTokensCost + refinedPromptRes.inputTokensCost,
    outputTokensCost:
      refinedMJMLTemplateRes.outputTokensCost +
      refinedPromptRes.outputTokensCost,
  };
};

const generateRefinedMjmlCode = async (
  content: ContentListUnion,
): Promise<AiFunctionResponse> => {
  const MODEL = models["gemini-3-pro-preview"];
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: MODEL.name,
      contents: content,
      config: {
        systemInstruction: prompts["system.refineTemplate.applyChanges"](),
      },
    }),
  );
  return parseAiFunctionResponse(
    response,
    MODEL.getInputTokensPrice,
    MODEL.getOutputTokensPrice,
  );
};

const rewritePromptForDownstreamModel = async (
  content: ContentListUnion,
): Promise<AiFunctionResponse> => {
  const MODEL = models["gemini-3-pro-preview"];
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: MODEL.name,
      contents: content,
      config: {
        systemInstruction: prompts["system.refineTemplate.rewrite"](),
      },
    }),
  );

  return parseAiFunctionResponse(
    response,
    MODEL.getInputTokensPrice,
    MODEL.getOutputTokensPrice,
  );
};
