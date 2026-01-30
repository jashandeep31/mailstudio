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
import { refinePrompt } from "./refine-prompt.js";
import { generateTemplate } from "./generate-template.js";
import { env } from "../../../lib/env.js";

interface CreateNewMailTemplateParams {
  prompt: string;
  brandKit: null | typeof brandKitsTable.$inferSelect;
  mediaUrls: string[];
}

export const createNewMailTemplate = async ({
  prompt,
  brandKit,
  mediaUrls,
}: CreateNewMailTemplateParams): Promise<AiGeneratedTemplate> => {
  //   if (env.ENVOIRONMENT === "development" && 1 === 1) {
  //     await new Promise<void>((res) => setTimeout(res, 2000));
  //     return {
  //       outputCode: `<mjml>
  //   <mj-body>
  //     <mj-section>
  //       <mj-column>
  //
  //         <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>
  //
  //         <mj-divider border-color="#F45E43"></mj-divider>
  //
  //         <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
  //
  //       </mj-column>
  //     </mj-section>
  //   </mj-body>
  // </mjml>`,
  //       prompt: "create the base mjml bare body",
  //       outputTokensCost: 0.1,
  //       inputTokensCost: 0.1,
  //     };
  //   }

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
    outputCode: extractMJMLOnly(mjmlTemplateResponse.outputText),
    prompt: refinedPromptRes.outputText,
    outputTokensCost:
      mjmlTemplateResponse.outputTokensCost + refinedPromptRes.outputTokensCost,
    inputTokensCost:
      mjmlTemplateResponse.inputTokensCost + refinedPromptRes.inputTokensCost,
  };
};
