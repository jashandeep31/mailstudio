import { and, creditWalletsTable, db, eq } from "@repo/db";
import { redis } from "../db.js";

// Key for storing in the wallet
const getKey = (userId: string) => `creditWallet::${userId}`;
/**
 * Returns the user wallet by id from redis or from database
 */
export const getCachedUserCreditWallet = async (
  userId: string,
): Promise<null | typeof creditWalletsTable.$inferSelect> => {
  const cachedWallet = await redis.get(getKey(userId));
  if (cachedWallet) {
    return JSON.parse(cachedWallet);
  }
  const [creditWallet] = await db
    .select()
    .from(creditWalletsTable)
    .where(and(eq(creditWalletsTable.user_id, userId)));
  if (creditWallet) {
    await redis.set(getKey(userId), JSON.stringify(creditWallet));
    return creditWallet;
  }
  return null;
};
/**
 * Set the new values to the user credit wallet cachedWallet
 */
export const revalidateUserCreditWalletCache = async (
  wallet: typeof creditWalletsTable.$inferSelect,
): Promise<void> => {
  const key = getKey(wallet.user_id);
  await redis.set(key, JSON.stringify(wallet));
};
