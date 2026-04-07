import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "./env.js";

const encoder = new TextEncoder();

const getSecret = () => {
  return encoder.encode(env.JWT_SECRET);
};

export interface SessionPayload extends JWTPayload {
  id: string;
  role: string;
}

export const signToken = async (payload: SessionPayload): Promise<string> => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
  return token;
};

export const verifyToken = async (
  token: string,
): Promise<SessionPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
};
