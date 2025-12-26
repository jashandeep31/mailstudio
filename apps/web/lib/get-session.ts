import { cookies } from "next/headers";
import { z } from "zod";
const sessionSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),
  role: z.string(),
});
export const getSession = async (): Promise<z.infer<
  typeof sessionSchema
> | null> => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session?.value) return null;
    const parsedSession = sessionSchema.safeParse(JSON.parse(session.value));
    if (parsedSession.success) {
      return parsedSession.data;
    }
    return null;
  } catch {
    return null;
  }
};
