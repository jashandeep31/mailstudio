import { prompts } from "../../prompts/index.js";
import { googleGenAi } from "../config.js";

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

export const updateUserInstructions = async (
  prompt: string,
  prevInstructions: string,
) => {
  const systemInstruction = prompts["system.updateUserInstructions"]();

  const response = await googleGenAi.models.generateContent({
    model: "models/gemini-flash-latest",
    contents: [{ text: prompt }, { text: prevInstructions }],
    config: {
      systemInstruction,
    },
  });
  return response.text!;
};
