import dotenv from "dotenv";
dotenv.config();

export const env: Record<string, string> = {
  PORT: process.env.PORT!,
} as const;

for (const key of Object.keys(env)) {
  if (!env[key]) {
    throw new Error(" PORT is not their");
  }
}
