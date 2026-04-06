import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface Session {
  id: string;
  role: string;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export const getSession = async (): Promise<Session | null> => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session");
    if (!sessionToken?.value) return null;

    const { payload } = await jwtVerify(sessionToken.value, getSecret());
    
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return null;
    }

    return {
      id: payload.userId,
      role: payload.role,
    };
  } catch {
    return null;
  }
};
