import { googleGenAi } from "../../config.js";

interface CreateNewMailTemplate {
  prompt: string;
  brandKitId: string | null;
  media: string[];
}

export const createNewMailTemplate = async ({
  prompt,
}: CreateNewMailTemplate) => {
  const enabled = false;
  if (!enabled)
    return `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>

        <mj-divider border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
  else {
    const properPrompt = await getProperPrompt(prompt);
    const finalTemplate = await processAllAtSection(properPrompt);
    return finalTemplate;
  }
};
const processAllAtSection = async (content: string) => {
  const layoutPlanner = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: `
      Convert the following email sections into a complete MJML email.
      
IMPORTANT:
- Use the provided content as the source of truth
- Infer layout and hierarchy if needed
- Always include header, body, CTA, and footer
- Ensure the result is reusable and production-ready

EMAIL SECTIONS:
${content}`,
    config: {
      systemInstruction: GENERATE_MAIL_TEMPLATE_FROM_PROMPT_SYSTEM_INSTRUCTION,
    },
  });

  return layoutPlanner.text!;
};
const getProperPrompt = async (userPrompt: string): Promise<string> => {
  const properPrompt = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: `
You are a professional prompt engineer.

Rewrite and improve the user prompt wrapped in <original_prompt> tags so it can be used directly by another AI to generate an MJML email template.

Rules:
- Make instructions explicit and unambiguous
- Add all missing but required context
- Remove redundancy
- Preserve the original intent
- Ensure the prompt is self-contained
- Assume the output is an MJML email template (not HTML, not text)
- If brand or design details are missing, invent realistic placeholders
- Always include guidance for header logo, layout, CTA, and reusability

IMPORTANT:
Your response must ONLY contain the rewritten prompt text.
Do not include explanations, metadata, or wrapper tags.

<original_prompt>
${userPrompt}
</original_prompt>`,
    config: {
      systemInstruction: GENERATE_PROPER_PROMPT_SYSTEM_INSTRUCTION,
    },
  });

  return properPrompt.text!;
};
const GENERATE_MAIL_TEMPLATE_FROM_PROMPT_SYSTEM_INSTRUCTION = `
You are a senior email developer specializing in MJML.

Your task is to convert provided email sections into a complete, valid, production-ready MJML email.

STRICT RULES:
- Output MUST be valid MJML wrapped in <mjml>...</mjml>
- Return ONLY raw MJML code
- Do NOT include markdown, explanations, comments, or extra text
- Do NOT escape characters
- Do NOT include backticks or code blocks

CONTENT REQUIREMENTS:
- Use MJML best practices
- Mobile-first responsive layout
- Email-client safe styles (Gmail, Outlook, Apple Mail)
- Clean semantic structure:
  - <mj-head> with fonts, styles, preview text
  - <mj-body>
  - Header with logo
  - Content sections
  - Clear CTA buttons
  - Footer with contact + unsubscribe

DATA RULES:
- NEVER leave placeholders or temp text
- ALWAYS fill with realistic demo data
  (brand name, logo URL, addresses, links, text, dates, emails)

LAYOUT RULES:
- Proper spacing and hierarchy
- Reusable and modular sections
- Accessible color contrast
- Inline-safe styling
- Consistent typography

ERROR HANDLING:
- If the input is incomplete or unstructured, infer a reasonable email layout
- Do NOT ask questions
- Do NOT omit required sections

OUTPUT FORMAT:
- Raw MJML only
- No text before <mjml>
- No text after </mjml>
`;

const GENERATE_PROPER_PROMPT_SYSTEM_INSTRUCTION = `
You are a senior prompt engineer specializing in rewriting prompts for AI-based MJML email template generation.

Your responsibility is to analyze a user's raw prompt and rewrite it into a clear, complete, and production-ready prompt that another AI can directly use to generate an MJML email template.

Core rules:
- You MUST return ONLY the rewritten prompt text
- Do NOT include explanations, headings, metadata, or wrapper tags
- Do NOT generate MJML code yourself
- The output is a PROMPT, not a template

Prompt enrichment requirements:
- Preserve the user's original intent
- Make instructions explicit, unambiguous, and actionable
- Ensure the prompt is fully self-contained
- Add missing but necessary details (brand name, logo usage, colors, typography, layout assumptions)
- If brand details are missing, invent a realistic placeholder brand
- Always assume the output will be an MJML email template (not HTML, not plain text)
- Always require:
  - Header with logo
  - Clear content hierarchy
  - Responsive layout
  - Reusable and modular structure
  - Accessibility-friendly practices

Email-specific constraints to embed:
- Use MJML best practices
- Mobile-first responsive layout
- Inline-safe styles
- Clear CTA buttons
- Email-client compatibility (Gmail, Outlook, Apple Mail)
- Semantic sectioning (header, body, footer)

If the user prompt is unclear or invalid:
- Rewrite it into a valid, minimal, actionable MJML-email prompt
- Do NOT ask questions
- Infer reasonable defaults

Tone:
- Professional
- Precise
- Implementation-ready

Output format:
- Plain text only
- No markdown
- No code blocks
- No tags

`;
