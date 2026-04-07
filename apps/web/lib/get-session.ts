import { cookies } from "next/headers";
import { z } from "zod";
const sessionSchema = z.object({
  id: z.string(),
  role: z.string(),
});

const decodeJwt = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getSession = async (): Promise<z.infer<
  typeof sessionSchema
> | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session?.value) return null;
    const decoded = decodeJwt(session.value);
    if (!decoded) return null;
    const parsedSession = sessionSchema.safeParse(decoded);
    if (parsedSession.success) {
      return parsedSession.data;
    }
    return null;
  } catch {
    return null;
  }
};
