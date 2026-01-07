import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT!,
  GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID!,
  GOOGLE_AUTH_SECRET_KEY: process.env.GOOGLE_AUTH_SECRET_KEY!,
  GOOGLE_AUTH_REDIRECT_URI: process.env.GOOGLE_AUTH_REDIRECT_URI!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  RESEND_BEARER_TOKEN: process.env.RESEND_BEARER_TOKEN,
} as const;

// Validate env variables
for (const [key, value] of Object.entries(env)) {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
}
