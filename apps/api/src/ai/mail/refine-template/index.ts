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

interface RefineMailTemplate {
  prompt: string;
  instructions?: string;
  brandKit: typeof brandKitsTable.$inferSelect | null;
  mediaUrls: string[];
  prevMjmlCode: string;
}

export const refineMailTemplate = async ({
  prompt,
  mediaUrls,
  prevMjmlCode,
  brandKit,
}: RefineMailTemplate): Promise<AiFunctionResponse> => {
  // uploading the files
  const uploadedFiles = await uploadMediaFiles(mediaUrls);
  await waitForFilesProcessing(uploadedFiles);
  const validFiles = getValidFiles(uploadedFiles);

  const brandKitData = brandKit ? getBrankitInAIFormatedWay(brandKit) : null;

  const refinedContent = buildContent(
    `
You are an expert MJML email template editor.
USER WANTS THESE CHANGES:
${prompt}
${brandKitData ? `BRAND KIT (follow strictly):\n${brandKitData}` : ""}

IMPORTANT RULES:
• Edit the EXISTING MJML code I provide
• Do NOT redesign from scratch
• Keep layout and sections unless change requires it
• Preserve responsiveness
• Keep MJML valid
• Do not remove working sections
• Return ONLY the full updated MJML code

HERE IS THE CURRENT MJML CODE TO EDIT:
${prevMjmlCode}
`,
    validFiles,
  );

  console.log(JSON.stringify(refinedContent));

  const refinedMJMLTemplateRes = await generateRefinedMjmlCode(refinedContent);
  return {
    outputText: extractMJMLOnly(refinedMJMLTemplateRes.outputText),
    inputTokensCost: refinedMJMLTemplateRes.inputTokensCost,
    outputTokensCost: refinedMJMLTemplateRes.outputTokensCost,
  };
};
