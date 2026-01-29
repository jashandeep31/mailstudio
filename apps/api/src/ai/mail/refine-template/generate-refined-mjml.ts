import { ContentListUnion } from "@google/genai";
import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";
import { AiFunctionResponse } from "../../types.js";
import { parseAiFunctionResponse } from "../../utils.js";
import { models } from "../../models.js";

export const generateRefinedMjmlCode = async (
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
