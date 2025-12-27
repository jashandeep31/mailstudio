import { GoogleGenAI } from "@google/genai";
import { env } from "../lib/env.js";

export const googleGenAi = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
