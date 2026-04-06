import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "./env.js";

const getSecret = () => new TextEncoder().encode(env.JWT_SECRET);

const SESSION_EXPIRATION = "30d";

export interface SessionPayload extends JWTPayload {
  userId: string;
  role: string;
}

export const signSession = async (userId: string, role: string): Promise<string> => {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(getSecret());
};

export const verifySession = async (
  token: string,
): Promise<SessionPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
};
