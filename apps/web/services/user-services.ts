import { BASE_URL } from "@/lib/contants";
import { creditWalletsTable, plansTable } from "@repo/db";
import axios from "axios";

export const getUserMetadata = async (): Promise<{
  creditsWallet: typeof creditWalletsTable.$inferSelect;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/metadata`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getUserPlan = async (): Promise<
  typeof plansTable.$inferSelect
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/plan`, {
    withCredentials: true,
  });

  return res.data.data;
};

export type BillingWithPayment = {
  id: string;
  plan_type: "free" | "starter_pack";
  amount: string | null;
  created_at: Date | null;
  payment: {
    settlement_amount: string | null;
    tax_amount: string | null;
    status: "pending" | "succeeded" | "failed" | "refunded" | null;
    payment_method: string | null;
  } | null;
};

export const getUserBillings = async (): Promise<BillingWithPayment[]> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/billings`, {
    withCredentials: true,
  });
  return res.data.data;
};

export type PaymentTransaction = {
  id: string;
  provider: "dodopayments" | "stripe" | "lemonsqueezy";
  settlement_amount: string | null;
  tax_amount: string | null;
  status: "pending" | "succeeded" | "failed" | "refunded";
  payment_method: string | null;
  card_last_four: string | null;
  card_network: string | null;
  created_at: Date;
};

export const getUserPayments = async (): Promise<PaymentTransaction[]> => {
  const res = await axios.get(`${BASE_URL}/api/v1/user/payments`, {
    withCredentials: true,
  });
  return res.data.data;
};
