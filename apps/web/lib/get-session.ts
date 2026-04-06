import { cookies } from "next/headers";
import { z } from "zod";
import { jwtVerify } from "jose";

const sessionSchema = z.object({
  id: z.string(),
  role: z.string(),
});

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export const getSession = async (): Promise<z.infer<
  typeof sessionSchema
> | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session?.value) return null;

    try {
      const { payload } = await jwtVerify(
        session.value,
        getJwtSecret(),
      );

      const parsedSession = sessionSchema.safeParse({
        id: payload.id,
        role: payload.role,
      });

      if (parsedSession.success) {
        return parsedSession.data;
      }
    } catch {
      return null;
    }
    return null;
  } catch {
    return null;
  }
};
