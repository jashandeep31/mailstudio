import * as jose from "jose";
import { env } from "../lib/env.js";
import { userRoleEnum } from "@repo/db";
import { z } from "zod";

const SESSION_SECRET = new TextEncoder().encode(env.HMAC_SECRET);

export const sessionPayloadSchema = z.object({
  id: z.string(),
  role: z.enum(userRoleEnum.enumValues),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;

export async function signSession(payload: {
  id: string;
  role: (typeof userRoleEnum.enumValues)[number];
}): Promise<string> {
  const jwt = await new jose.SignJWT(payload as jose.JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS} seconds`)
    .sign(SESSION_SECRET);

  return jwt;
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, SESSION_SECRET, {
      algorithms: ["HS256"],
    });

    return sessionPayloadSchema.parse(payload);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
