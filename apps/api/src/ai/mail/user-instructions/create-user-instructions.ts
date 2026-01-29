import { prompts } from "../../../prompts/index.js";
import { googleGenAi } from "../../config.js";

export const createUserInstructions = async (
  prompt: string,
): Promise<string> => {
  const systemInstruction = prompts["sytem.createUserInstructions"]();
  const response = await googleGenAi.models.generateContent({
    model: "models/gemini-flash-latest",
    contents: [{ text: prompt }],
    config: {
      systemInstruction,
    },
  });
  return response.text!;
};
