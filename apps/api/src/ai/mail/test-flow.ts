import { Type } from "@google/genai";
import { googleGenAi } from "../config.js";
import fs from "node:fs";
import { z } from "zod";

const PROPER_PROMPT: boolean = false;
const LAYOUT_LAYOUT_PROMPT: boolean = false;

export const testFlow = async () => {
  const properPromptresponse = await getProperPrompt();
  console.log(`proper res is theri`);
  const layoutResponse = (
    await getlayoutplanner(properPromptresponse, SYSTEM_INSTRUCTION_PLANNER)
  )
    .replace("```json", "")
    .replace("```", "");
  const array = JSON.parse(layoutResponse);
  await processAllAtSection(
    JSON.stringify(array),
    processAllAtSectionInstructon,
  );
  // let prevRes = "";
  // // for (const section of array) {
  // //   console.log(section.title);
  // //   prevRes = await processEachSection(
  // //     prevRes + section.description!,
  // //     processEachSectionInstructon,
  // //   );
  // // }
  console.log(`done`);
  // console.log(JSON./str);
};
const processAllAtSection = async (content: string, instruction: string) => {
  const layoutPlanner = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: content!,
    config: { systemInstruction: instruction },
  });
  console.log(layoutPlanner.text);
  fs.writeFileSync("final.txt", layoutPlanner.text!);
  return layoutPlanner.text!;
};

const processAllAtSectionInstructon = `You are profesioan emial writert in teh mjml format you write hte email in the proper format to be send across the client you ahve been based all the sections of the email please wrtie the them down in the proepr mjml mail which keeps it sself rpseonseive`;

const processEachSection = async (content: string, instruction: string) => {
  const layoutPlanner = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: content!,
    config: { systemInstruction: instruction },
  });
  console.log(layoutPlanner.text);
  fs.writeFileSync("final.txt", layoutPlanner.text!);
  return layoutPlanner.text!;
};

const processEachSectionInstructon = `
Your are proffessional mjml; repsonsive email template writer we pass you each section of the email tempalte and you ahve to write it down to the mjml format while maiing the repsnoseive and hte other thisngs about hte section end result should be teh mjml wiht that section if their anyting inte mjml like section please ocntineue taking ti over with you you have to retun the full code`;

const getlayoutplanner = async (
  content: string,
  instruction: string,
): Promise<string> => {
  if (LAYOUT_LAYOUT_PROMPT) {
    const layoutPlanner = await googleGenAi.models.generateContent({
      model: "models/gemini-3-pro-preview",
      contents: content!,
      config: { systemInstruction: instruction },
    });

    fs.writeFileSync("layout.txt", layoutPlanner.text!);
    return layoutPlanner.text!;
  }
  const res = fs.readFileSync("layout.txt", "utf-8");
  return res;
};

const getProperPrompt = async (): Promise<string> => {
  if (PROPER_PROMPT) {
    const userPrompt = `Generate  the mail template for the i can send to hte client how have 3 items in teh cart form last 5 dastys i wanna ask him to make checkout and get the discount of 10% by using the code test.`;
    const properPrompt = await googleGenAi.models.generateContent({
      model: "models/gemini-3-pro-preview",
      contents: userPrompt + JSON.stringify(brandKit),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["sections"],
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["name", "detail"],
                properties: {
                  name: {
                    type: Type.STRING,
                  },
                  detail: {
                    type: Type.STRING,
                  },
                },
              },
            },
          },
        },
      },
    });

    fs.writeFileSync("proper.txt", properPrompt.text!);
    return properPrompt.text!;
  }
  const pastResponse = fs.readFileSync("proper.txt", "utf-8");
  return pastResponse;
};

const SYSTEM_INSTRUCTION_PLANNER = `
You are a senior email layout designer specializing in MJML-based email systems.

Your task is to describe the email layout in detail, section by section each section should include the proper like hwat the design layout sholud have to be where should you align teh thigns and which assest shuld have to be used here and how means pin perfect detailsz.

You must return ONLY JSON that matches the provided schema.

Rules:
- Do NOT generate MJML, HTML, or code.
- Do NOT summarize.
- Write detailed, instructional text for each section.
- Each section description MUST explicitly mention:
  - layout and alignment
  - spacing and hierarchy
  - colors and typography usage
  - brand assets used (logo URLs, images, links)
  - purpose of the section
- Do NOT invent assets.
- If something is missing, refer to it as a placeholder.

Your output must strictly match the schema.
`;

const SYSTEM_INSTRUCTION = `
You are a senior AI prompt engineer specializing in email design systems.

Your job is NOT to generate MJML or HTML.

Your job is to convert a raw user request and brand details into a
CLEAR, DETAILED, STRUCTURED DESIGN PROMPT that will later be used
to generate an MJML email template.

Rules:
- Do NOT generate MJML, HTML, or code.
- Do NOT invent brand information.
- Do NOT assume missing data unless explicitly allowed.
- Be precise and unambiguous.
- Convert vague requests into explicit instructions.
- Use the provided brand kit as the source of truth.

Your output MUST follow the exact JSON structure defined below.
If information is missing, mark it as "unknown" instead of guessing.
`;

export const brandKit = {
  // ---------- Core Identity ----------
  name: "Acme",
  legalName: "Acme Commerce Pvt Ltd",
  description:
    "Acme is a modern ecommerce brand focused on fast delivery and premium quality products.",

  // ---------- Visual Identity ----------
  logo: {
    primary:
      "https://images.seeklogo.com/logo-png/51/1/shadcn-ui-logo-png_seeklogo-519786.png",
    secondary:
      "https://images.seeklogo.com/logo-png/51/1/shadcn-ui-logo-png_seeklogo-519786.png",
    altText: "Acme logo",
  },

  colors: {
    primary: "#4F46E5", // main brand color
    secondary: "#22C55E", // accent / success
    background: "#FFFFFF",
    surface: "#F8FAFC",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    border: "#E2E8F0",
    danger: "#EF4444",
    warning: "#F59E0B",
  },

  // ---------- Typography ----------
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    headingFontFamily: "Inter, Arial, sans-serif",
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    fontSizes: {
      h1: "22px",
      h2: "18px",
      h3: "16px",
      body: "14px",
      small: "12px",
    },
    lineHeight: {
      heading: "1.3",
      body: "1.6",
    },
  },

  // ---------- Buttons & UI ----------
  buttons: {
    primary: {
      backgroundColor: "#4F46E5",
      textColor: "#FFFFFF",
      borderRadius: "6px",
      padding: "12px 20px",
      fontWeight: 600,
    },
    secondary: {
      backgroundColor: "#22C55E",
      textColor: "#FFFFFF",
      borderRadius: "6px",
      padding: "10px 18px",
      fontWeight: 500,
    },
  },

  // ---------- Email Design Preferences ----------
  email: {
    maxWidth: "600px",
    backgroundColor: "#F8FAFC",
    contentBackground: "#FFFFFF",
    sectionSpacing: "20px",
    borderRadius: "8px",
    shadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  // ---------- Tone & Voice ----------
  tone: {
    voice: "friendly",
    style: "professional",
    personality: ["trustworthy", "modern", "helpful"],
    emojiUsage: "minimal", // none | minimal | moderate
  },

  // ---------- Common URLs ----------
  urls: {
    website: "https://acme.com",
    checkout: "https://acme.com/checkout",
    cart: "https://acme.com/cart",
    support: "https://acme.com/support",
    unsubscribe: "https://acme.com/unsubscribe",
    privacyPolicy: "https://acme.com/privacy",
    terms: "https://acme.com/terms",
  },

  // ---------- Footer Information ----------
  footer: {
    companyAddress: "123 Business Street, Bangalore, India",
    contactEmail: "support@acme.com",
    copyrightText: "© {{year}} Acme. All rights reserved.",
    socialLinks: {
      twitter: "https://twitter.com/acme",
      instagram: "https://instagram.com/acme",
      facebook: "https://facebook.com/acme",
    },
  },

  // ---------- Constraints & Rules ----------
  constraints: {
    maxProductsInEmail: 3,
    maxCTAs: 1,
    showDiscountAboveFold: true,
    showUnsubscribe: true,
  },

  // ---------- Accessibility ----------
  accessibility: {
    minContrastRatio: 4.5,
    altTextRequired: true,
    buttonMinHeight: "44px",
  },

  // ---------- AI Instructions ----------
  aiHints: {
    preferredCTAStyle: "bold",
    avoidPhrases: ["cheap", "guaranteed"],
    emphasize: ["limited time", "customer benefit"],
  },
};
