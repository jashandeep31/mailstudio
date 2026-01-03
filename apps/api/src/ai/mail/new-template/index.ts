import { Type } from "@google/genai";
import { googleGenAi } from "../../config.js";

interface CreateNewMailTemplate {
  prompt: string;
  brandKitId: string | null;
  media: string[]
}

export const createNewMailTemplate = async ({ prompt }: CreateNewMailTemplate) => {
  // 1. get the proper prompt
  const properPrompt = await getProperPrompt(prompt)

  const finalTemplate = await processAllAtSection(properPrompt)
  console.log(finalTemplate)
}
const processAllAtSection = async (content: string) => {
  const processAllAtSectionInstruction = `You are a professional email writer in the MJML format. You write emails in the proper format to be sent to clients. You have been given all the sections of the email. Please write them in proper MJML format which keeps itself responsive. Don't leave anything with temp data - always fill in demo data when you are creating content. Return ONLY the raw MJML code - no markdown formatting, no code blocks, no escape characters, just the working MJML code.`;

  const layoutPlanner = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: content!,
    config: {
      systemInstruction: processAllAtSectionInstruction,
      // Remove responseMimeType and responseSchema to get plain text
    },
  });

  return layoutPlanner.text!;
};
const getProperPrompt = async (userPrompt: string,): Promise<string> => {
  const SYSTEM_INSTRUCTION = `
You are a proffesional prompt rewriter. what you do is that the user passes you the prompt and you enazlize the prompt and rewrite that prompt in the better way that another ai can understand it.
You don't return the code instead you just return the prompt some times user may send you only the prompt to create the emailte template or sometime with the brankit 
then you have to analayize hte prompt and then embed the necessary information to the prompt like brankdtails and more that are needed to create that emial template
if the thngs are not present then add somenfo like a dummy brand from your side so taht the prompts gets fullfiled for tne anotehr ai 
you have to include hte each pin point infromation in to the rpompt that whawt does user does adn hwo we can make it better by making better i wman create hte tempalte that has logo in the headher nad more info regarding it aso alwys to be precise.
you don't create the nomral template the prompt is for hte creating the mjml template for email that user can reuse for theri website no the normal text template its going to be the mjml one 
`
  const properPrompt = await googleGenAi.models.generateContent({
    model: "models/gemini-3-pro-preview",
    contents: userPrompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  return properPrompt.text!;
};


