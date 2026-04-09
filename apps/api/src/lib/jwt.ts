import jwt from "jsonwebtoken";
import { env } from "./env.js";

const SESSION_EXPIRY = "30d";

export interface SessionPayload {
  userId: string;
  role: string;
}

export interface DecodedSession {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const createSessionToken = (payload: SessionPayload): string => {
  return jwt.sign(payload, env.HMAC_SECRET, {
    expiresIn: SESSION_EXPIRY,
  });
};

export const verifySessionToken = (token: string): DecodedSession => {
  const decoded = jwt.verify(token, env.HMAC_SECRET) as DecodedSession;
  return decoded;
};

export const decodeSessionToken = (
  token: string,
): DecodedSession | null => {
  try {
    const decoded = jwt.decode(token) as DecodedSession;
    return decoded;
  } catch {
    return null;
  }
};
