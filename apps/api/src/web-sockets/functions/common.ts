import {
  creditsGrantsTable,
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
  totalConsumedAmount: number;
}

/**
 * Updates the user's credit wallet
 * @param socket - The WebSocket connection
 * @param totalCost - The total cost of the operation
 */

export const updateUserCreditWallet = async ({
  socket,
  totalConsumedAmount: totalConsumedAmount,
}: updateUserCreditWallet) => {
  const result = await db.transaction(async (tx) => {
    let costLeft = Number(totalConsumedAmount);
    let totalDeducted = 0;

    // 1️⃣ Lock grants
    const grants = await tx.execute(sql`
      SELECT id, remaining_amount
      FROM ${creditsGrantsTable}
      WHERE user_id = ${socket.userId}
        AND remaining_amount > 0 AND is_expired = false
      ORDER BY expires_at ASC
      FOR UPDATE
    `);

    // 2️⃣ Deduct as much as possible
    for (const grant of grants.rows) {
      if (costLeft <= 0) break;
      const remaining = Number(grant.remaining_amount);
      const deduction = Math.min(remaining, costLeft);
      await tx.execute(sql`
        UPDATE ${creditsGrantsTable}
        SET remaining_amount = remaining_amount - ${deduction},
            updated_at = NOW()
        WHERE id = ${grant.id}
      `);
      costLeft -= deduction;
      totalDeducted += deduction;
    }

    const balanceResult = await tx.execute(sql`
      SELECT COALESCE(SUM(remaining_amount), 0) AS balance
      FROM ${creditsGrantsTable}
      WHERE user_id = ${socket.userId}
    `);

    if (!balanceResult.rows || balanceResult.rows.length === 0) {
      return undefined;
    }

    const newBalance = Number(balanceResult.rows[0]?.balance); // will be 0 if fully drained

    // 4️⃣ Update wallet summary
    const [wallet] = await tx
      .update(creditWalletsTable)
      .set({
        balance: String(newBalance),
        updated_at: new Date(),
      })
      .where(eq(creditWalletsTable.user_id, socket.userId))
      .returning();

    // 5️⃣ Log only what was actually deducted
    if (totalDeducted > 0 && wallet) {
      await tx.insert(creditTransactionsTable).values({
        wallet_id: wallet.id,
        user_id: socket.userId,
        amount: String(totalDeducted.toFixed(2)), // actual spent
        after_balance: String(newBalance),
        type: "spent",
        reason: "Spent on AI creation",
      });
    }

    return wallet;
  });

  if (result) {
    await revalidateUserCreditWalletCache(result);
  }
};
