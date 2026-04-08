import { cookies } from "next/headers";
import { z } from "zod";
const jwtPayloadSchema = z.object({
  userId: z.string(),
  role: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

const base64UrlDecode = (str: string): string => {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
};

const decodeJWT = (token: string): z.infer<typeof jwtPayloadSchema> | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return jwtPayloadSchema.parse(payload);
  } catch {
    return null;
  }
};

export const getSession = async (): Promise<z.infer<
  typeof jwtPayloadSchema
> | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session?.value) return null;
    return decodeJWT(session.value);
  } catch {
    return null;
  }
};
