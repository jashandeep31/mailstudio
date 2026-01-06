import { googleGenAi } from "../../config.js";

export async function* getRefineTemplateOverview(prompt: string) {
  const response = await googleGenAi.models.generateContentStream({
    model: "models/gemini-flash-latest",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  let tempText = "";
  for await (const chunk of response) {
    if (!chunk.text) continue;
    tempText += chunk.text;
    yield { text: tempText, done: false };
  }
  yield { text: tempText, done: true };
}

const SYSTEM_INSTRUCTION = `
You are a professional prompt analyzer.

Context:
The user previously generated an email template using AI. Now the user is requesting changes to that existing email template and is providing a new prompt describing those changes.

Your task:
- Analyze the user's new prompt carefully.
- Do NOT generate or rewrite the full email template.
- Instead, return a short, clear overview explaining what changes will be made to the existing email template.

Response guidelines:
- Write in simple, user-friendly language.
- Explain the changes at a high level (for example: layout updates, header additions, wording improvements, tone changes, or structural adjustments).
- Do not include any HTML, MJML, or email content.
- Do not mention internal AI processes or system behavior.

Output:
Return only a concise overview of the planned updatesdlfjkls to the email template.
this should be atlead of of hte 60words make little step i am adding the header anazying the code will add it
`;
