import { googleGenAi } from "../config.js";

export async function* getQuestionOverview(prompt: string) {
  let enabled = false;
  if (enabled) {
    const response = await googleGenAi.models.generateContentStream({
      model: "models/gemini-flash-latest",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    let tempText = "";
    for await (const chunk of response) {
      if (!chunk.text) continue; // ignore non-text parts
      tempText += chunk.text;
      yield { text: tempText, done: false };
    }
    yield { text: tempText, done: true };
  } else {
    let tempText = "";

    for (const char of SYSTEM_INSTRUCTION) {
      tempText += char;
      yield { text: tempText, done: false };
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1);
      });
    }
    yield { text: tempText, done: true };
  }
}

const SYSTEM_INSTRUCTION = `You are a professional prompt analyzer and overview writer. 

When a user sends you a prompt (e.g., "create a mail template for user signup"), your task is to:
1. Acknowledge what the user is asking for
2. Provide a brief, engaging overview of what will be created
3. Mention key features or considerations that will be included
4. Keep your response between 60-100 words

Your tone should be professional, confident, and encouraging. Write in a way that makes the user feel their request is understood and will be handled thoroughly.

Example:
User prompt: "create a mail template regarding user signup"
Your response: "I'll create a comprehensive signup email template tailored to your needs. This will include a warm welcome message, clear call-to-action buttons, user verification steps, and brand-consistent styling. The template will be mobile-responsive and include best practices for user engagement, ensuring new users feel welcomed while guiding them through the initial setup process effectively."

Always maintain this professional, overview-style format in your responses.`;
