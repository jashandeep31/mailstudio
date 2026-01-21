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
import { AiFunctionResponse } from "../../types.js";
import {
  getBrankitInAIFormatedWay,
  parseAiFunctionResponse,
} from "../../utils.js";
import { models } from "../../models.js";
import { brandKitsTable } from "@repo/db";
import { extractMJMLOnly } from "../../../lib/mjml-helpers.js";

interface CreateNewMailTemplateParams {
  prompt: string;
  brandKit: null | typeof brandKitsTable.$inferSelect;
  mediaUrls: string[];
}

export const createNewMailTemplate = async ({
  prompt,
  brandKit,
  mediaUrls,
}: CreateNewMailTemplateParams): Promise<AiFunctionResponse> => {
  const uploadedFiles = await uploadMediaFiles(mediaUrls);
  await waitForFilesProcessing(uploadedFiles);
  const brandKitData = brandKit ? getBrankitInAIFormatedWay(brandKit) : null;
  const validFiles = getValidFiles(uploadedFiles);

  const contentWithPrompt = buildContent(
    brandKitData ? `${prompt} \n ${brandKitData}` : prompt,
    validFiles,
  );

  const refinedPromptRes = await refinePrompt(contentWithPrompt);
  console.log(refinedPromptRes.outputText);
  const contentWithRefinedPrompt = buildContent(
    refinedPromptRes.outputText,
    validFiles,
  );

  const mjmlTemplateResponse = await generateTemplate(contentWithRefinedPrompt);
  return {
    outputText: extractMJMLOnly(mjmlTemplateResponse.outputText),
    outputTokensCost:
      mjmlTemplateResponse.outputTokensCost + refinedPromptRes.outputTokensCost,
    inputTokensCost:
      mjmlTemplateResponse.inputTokensCost + refinedPromptRes.inputTokensCost,
  };
};

const refinePrompt = async (
  content: ContentListUnion,
): Promise<AiFunctionResponse> => {
  console.log("Refining prompt...");

  const MODEL = models["gemini-3-pro-preview"];
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: MODEL.name,
      contents: content,
      config: {
        systemInstruction: prompts["system.newTemplate.properPrompt"](),
      },
    }),
  );

  return parseAiFunctionResponse(
    response,
    MODEL.getInputTokensPrice,
    MODEL.getOutputTokensPrice,
  );
};

const generateTemplate = async (
  content: ContentListUnion,
): Promise<AiFunctionResponse> => {
  console.log("Generating template...");
  const MODEL = models["gemini-3-pro-preview"];
  const response = await retryWithDelay(() =>
    googleGenAi.models.generateContent({
      model: MODEL.name,
      contents: content,
      config: {
        systemInstruction: prompts["system.newTemplate.generation"](),
      },
    }),
  );
  return parseAiFunctionResponse(
    response,
    MODEL.getInputTokensPrice,
    MODEL.getOutputTokensPrice,
  );
};
