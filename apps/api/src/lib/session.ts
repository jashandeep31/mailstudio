import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { z } from "zod";

export const sessionPayloadSchema = z.object({
  id: z.string(),
  role: z.string(),
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

const SESSION_EXPIRY = "30d";

export const signSession = (payload: SessionPayload): string => {
  return jwt.sign(payload, env.HMAC_SECRET, {
    expiresIn: SESSION_EXPIRY,
  });
};

export const verifySession = (
  token: string,
): { valid: true; payload: SessionPayload } | { valid: false; error: string } => {
  try {
    const decoded = jwt.verify(token, env.HMAC_SECRET);
    const parsed = sessionPayloadSchema.parse(decoded);
    return { valid: true, payload: parsed };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, error: "Session expired. Please login again." };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { valid: false, error: "Invalid session token. Please login again." };
    }
    return { valid: false, error: "Invalid session format. Please login again." };
  }
};

export const decodeSession = (
  token: string,
): SessionPayload | null => {
  try {
    const decoded = jwt.decode(token) as SessionPayload;
    if (!decoded) return null;
    const parsed = sessionPayloadSchema.safeParse(decoded);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};
