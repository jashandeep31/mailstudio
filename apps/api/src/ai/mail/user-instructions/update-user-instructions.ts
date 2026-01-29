import { prompts } from "../../../prompts/index.js";
import { googleGenAi } from "../../config.js";

export const updateUserInstructions = async (
  prompt: string,
  prevInstructions: string,
) => {
  try {
    const systemInstruction = prompts["system.updateUserInstructions"]();

    const response = await googleGenAi.models.generateContent({
      model: "models/gemini-flash-latest",
      contents: [{ text: prompt }, { text: prevInstructions }],
      config: {
        systemInstruction,
      },
    });
    console.log(`system upated`);
    return response.text!;
  } catch (e) {
    console.log(e);
    return "";
  }
};
