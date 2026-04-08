import * as jose from "jose";
import { env } from "./env.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export interface JWTPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const signJWT = async (payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> => {
  const jwt = await new jose.SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
  return jwt;
};

export const verifyJWT = async (token: string): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};
