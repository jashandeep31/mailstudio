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
}: RefineMailTemplate): Promise<AiFunctionResponse> => {
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
    outputText: extractMJMLOnly(refinedMJMLTemplateRes.outputText),
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
  try {
    const MODEL = models["gemini-3-pro-preview"];
    console.log(`things are started of hte refineMJML`);
    const response = await googleGenAi.models.generateContent({
      model: MODEL.name,
      contents: content,
      config: {
        systemInstruction: prompts["system.refineTemplate.applyChanges"](),
      },
    });
    console.log(`MJML refined`);
    console.log(response);
    return parseAiFunctionResponse(
      response,
      MODEL.getInputTokensPrice,
      MODEL.getOutputTokensPrice,
    );
  } catch (e) {
    console.log(e);
    return {
      outputText: "",
      inputTokensCost: 0,
      outputTokensCost: 0,
    };
  }
};

const rewritePromptForDownstreamModel = async (
  content: ContentListUnion,
): Promise<AiFunctionResponse> => {
  try {
    console.log(`we are are refining the prompt `);
    const MODEL = models["gemini-3-pro-preview"];
    console.log(content);
    const response = await googleGenAi.models.generateContent({
      model: MODEL.name,
      contents: content,
      config: {
        systemInstruction: prompts["system.refineTemplate.rewrite"](),
      },
    });
    console.log(response);
    return parseAiFunctionResponse(
      response,
      MODEL.getInputTokensPrice,
      MODEL.getOutputTokensPrice,
    );
  } catch (error) {
    console.log(error);
    return {
      outputText: "",
      inputTokensCost: 0,
      outputTokensCost: 0,
    };
  }
};
