import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT!,
  GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID!,
  GOOGLE_AUTH_SECRET_KEY: process.env.GOOGLE_AUTH_SECRET_KEY!,
  GOOGLE_AUTH_REDIRECT_URI: process.env.GOOGLE_AUTH_REDIRECT_URI!,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  RESEND_BEARER_TOKEN: process.env.RESEND_BEARER_TOKEN,
  BACKEND_URL: process.env.BACKEND_URL!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  CLOUDFLARE_R2_REGION: process.env.CLOUDFLARE_R2_REGION!,
  CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT!,
  CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
  CLOUDFLARE_R2_PUBLIC_DOMAIN: process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN!,
  HMAC_SECRET: process.env.HMAC_SECRET!,
  DODO_PAYMENTS_API_KEY: process.env.DODO_PAYMENTS_API_KEY!,
  DODO_PAYMENTS_WEBHOOK_SECRET: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,
  DODO_PAYMENTS_ENVIRONMENT: (process.env.DODO_PAYMENTS_ENVIRONMENT ||
    "live_mode") as "live_mode" | "test_mode",
  DODO_STARTER_PRODUCT_ID: process.env.DODO_STARTER_PRODUCT_ID!,
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY!,
  PROFIT_PERCENTAGE: Number(process.env.PROFIT_PERCENTAGE!),
} as const;

// Validate env variables
for (const [key, value] of Object.entries(env)) {
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
}
