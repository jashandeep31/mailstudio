import { ContentListUnion } from "@google/genai";
import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";
import { AiFunctionResponse } from "../../types.js";
import { parseAiFunctionResponse } from "../../utils.js";
import { models } from "../../models.js";

export const rewritePromptForDownstreamModel = async (
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
