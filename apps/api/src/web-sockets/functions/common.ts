import {
  creditTransactionsTable,
  creditWalletsTable,
  db,
  eq,
  sql,
} from "@repo/db";
import WebSocket from "ws";

interface updateUserCreditWallet {
  socket: WebSocket;
  totalCost: number;
}
export const updateUserCreditWallet = async ({
  socket,
  totalCost,
}: updateUserCreditWallet) => {
  await db.transaction(async (tx) => {
    const [wallet] = await tx
      .update(creditWalletsTable)
      .set({
        updated_at: new Date(),
        balance: sql`${creditWalletsTable.balance} - ${totalCost}`,
      })
      .where(eq(creditWalletsTable.user_id, socket.userId))
      .returning();
    if (!wallet) return;
    console.log(wallet);
    await tx.insert(creditTransactionsTable).values({
      wallet_id: wallet.id,
      user_id: socket.userId,
      amount: String(Number(totalCost).toFixed(2)),
      after_balance: wallet.balance,
      type: "spent",
    });
  });
};
