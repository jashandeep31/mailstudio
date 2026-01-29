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
  //uploading the files
  const uploadedFiles = await uploadMediaFiles(mediaUrls);
  await waitForFilesProcessing(uploadedFiles);
  const validFiles = getValidFiles(uploadedFiles);

  // creating the content with the  brandkit, prompt
  const brandKitData = brandKit ? getBrankitInAIFormatedWay(brandKit) : null;
  const contentWithPrompt = buildContent(
    brandKitData ? `${prompt} \n ${brandKitData}` : prompt,
    validFiles,
  );

  // creating the refinded prompt that wiil use to get the final code
  const refinedPromptRes = await refinePrompt(contentWithPrompt);

  // adding the attached files  to the final ai response
  const contentWithRefinedPrompt = buildContent(
    refinedPromptRes.outputText,
    validFiles,
  );

  // final ai response just the template code
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
  const MODEL = models["gemini-3-pro-preview"];
  const response = await googleGenAi.models.generateContent({
    model: MODEL.name,
    contents: content,
    config: {
      systemInstruction: prompts["system.newTemplate.properPrompt"](),
    },
  });

  return parseAiFunctionResponse(
    response,
    MODEL.getInputTokensPrice,
    MODEL.getOutputTokensPrice,
  );
};

const generateTemplate = async (
  content: ContentListUnion,
): Promise<AiFunctionResponse> => {
  const MODEL = models["gemini-3-pro-preview"];
  const response = await googleGenAi.models.generateContent({
    model: MODEL.name,
    contents: content,
    config: {
      systemInstruction: prompts["system.newTemplate.generation"](),
    },
  });

  return parseAiFunctionResponse(
    response,
    MODEL.getInputTokensPrice,
    MODEL.getOutputTokensPrice,
  );
};
