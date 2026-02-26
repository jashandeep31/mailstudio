import { ContentListUnion } from "@google/genai";
import { googleGenAi } from "../../config.js";
import { prompts } from "../../../prompts/index.js";
import { AiFunctionResponse } from "../../types.js";
import { parseAiFunctionResponse } from "../../utils.js";
import { models } from "../../models.js";

export const generateTemplate = async (
  content: ContentListUnion,
): Promise<AiFunctionResponse> => {
  const MODEL = models["gemini-3.1-pro-preview"];
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
