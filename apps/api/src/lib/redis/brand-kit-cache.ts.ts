import { and, brandKitsTable, db, eq } from "@repo/db";
import { redis } from "../db.js";

const getKey = (id: string, userId: string) => {
  return `brandkit::${userId}::${id}`;
};

/*
 * @returns brandkit | null
 * @param id brandkit id
 * @param userId user id
 */
export const getCachedBrandKit = async (
  id: string,
  userId: string,
): Promise<typeof brandKitsTable.$inferSelect | null> => {
  const cached = await redis.get(getKey(id, userId));
  if (cached) {
    return JSON.parse(cached);
  }
  const [brandKit] = await db
    .select()
    .from(brandKitsTable)
    .where(and(eq(brandKitsTable.id, id), eq(brandKitsTable.user_id, userId)));

  if (!brandKit) return null;
  await redis.set(getKey(id, userId), JSON.stringify(brandKit), "EX", 60 * 5);
  return brandKit;
};

export const delCachedBrandKit = async (id: string, userId: string) => {
  await redis.del(getKey(id, userId));
};
