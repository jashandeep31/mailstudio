import {
  creditTransactionsTable,
  creditWalletsTable,
  db,
  eq,
  sql,
} from "@repo/db";
import WebSocket from "ws";
import { revalidateUserCreditWalletCache } from "../../lib/redis/user-credit-wallet-cache.js";

interface updateUserCreditWallet {
  socket: WebSocket;
  totalCost: number;
}

/**
 * Updates the user's credit wallet
 * @param socket - The WebSocket connection
 * @param totalCost - The total cost of the operation
 */
export const updateUserCreditWallet = async ({
  socket,
  totalCost,
}: updateUserCreditWallet) => {
  const wallet = await db.transaction(async (tx) => {
    //TODO: better mechanism to handle the wallet is needed
    const [wallet] = await tx
      .update(creditWalletsTable)
      .set({
        updated_at: new Date(),
        balance: sql`${creditWalletsTable.balance} - ${totalCost}`,
      })
      .where(eq(creditWalletsTable.user_id, socket.userId))
      .returning();
    if (!wallet) return;
    await tx.insert(creditTransactionsTable).values({
      wallet_id: wallet.id,
      user_id: socket.userId,
      amount: String(Number(totalCost).toFixed(2)),
      after_balance: Number(wallet.balance) > 0 ? wallet.balance : String(0),
      type: "spent",
      reason: "Spent on the ai creation",
    });
    if (Number(wallet.balance) < 0) {
      // updaing the wallet again so that if its in the negative then we can handle it
      await tx
        .update(creditWalletsTable)
        .set({
          updated_at: new Date(),
          balance: String(0),
        })
        .where(eq(creditWalletsTable.user_id, socket.userId));
    }
    return wallet;
  });
  if (wallet) {
    await revalidateUserCreditWalletCache(wallet);
  }
};
