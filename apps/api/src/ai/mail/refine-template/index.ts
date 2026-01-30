import { AiFunctionResponse, AiGeneratedTemplate } from "../../types.js";
import {
  uploadMediaFiles,
  waitForFilesProcessing,
  getValidFiles,
  buildContent,
  getBrankitInAIFormatedWay,
} from "../../utils.js";
import { brandKitsTable } from "@repo/db";
import { extractMJMLOnly } from "../../../lib/mjml-helpers.js";
import { generateRefinedMjmlCode } from "./generate-refined-mjml.js";
import { rewritePromptForDownstreamModel } from "./rewrite-prompt.js";

interface RefineMailTemplate {
  prompt: string;
  instructions?: string;
  brandKit: typeof brandKitsTable.$inferSelect | null;
  mediaUrls: string[];
  prevMjmlCode: string;
}

export const refineMailTemplate = async ({
  prompt,
  instructions,
  mediaUrls,
  prevMjmlCode,
  brandKit,
}: RefineMailTemplate): Promise<AiGeneratedTemplate> => {
  const uploadedFiles = await uploadMediaFiles(mediaUrls);
  const brandKitData = brandKit ? getBrankitInAIFormatedWay(brandKit) : null;
  await waitForFilesProcessing(uploadedFiles);

  const validFiles = getValidFiles(uploadedFiles);
  const contentWithPrompt = buildContent(
    `
NEW USER INPUT:
${prompt}
EXISTING USER INSTRUCTIONS:
${instructions}
${brandKitData ? `BRANDKIT: \n${brandKitData}` : ""}
TASK:
Update the existing instructions based strictly on the new user input.
Preserve all preferences that are not explicitly changed.
Return only the updated instructions as a single paragraph.
`,
    validFiles,
  );

  console.log(`things are started`);
  const refinedPromptRes =
    await rewritePromptForDownstreamModel(contentWithPrompt);
  console.log(`refined the prompt`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const refinedContent = buildContent(
    refinedPromptRes.outputText + "\n\n" + prevMjmlCode,
    validFiles,
  );

  const refinedMJMLTemplateRes = await generateRefinedMjmlCode(refinedContent);
  console.log(`refined the MJML`);
  return {
    outputCode: extractMJMLOnly(refinedMJMLTemplateRes.outputText),
    prompt: refinedPromptRes.outputText,
    inputTokensCost:
      refinedMJMLTemplateRes.inputTokensCost + refinedPromptRes.inputTokensCost,
    outputTokensCost:
      refinedMJMLTemplateRes.outputTokensCost +
      refinedPromptRes.outputTokensCost,
  };
};
