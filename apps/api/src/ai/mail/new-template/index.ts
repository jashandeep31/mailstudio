import { AiFunctionResponse } from "../../types.js";
import {
  uploadMediaFiles,
  waitForFilesProcessing,
  getValidFiles,
  buildContent,
  getBrankitInAIFormatedWay,
} from "../../utils.js";
import { brandKitsTable } from "@repo/db";
import { extractMJMLOnly } from "../../../lib/mjml-helpers.js";
import { refinePrompt } from "./refine-prompt.js";
import { generateTemplate } from "./generate-template.js";

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
