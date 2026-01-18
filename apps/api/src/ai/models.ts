import { env } from "../lib/env.js";

const MILLION = 1_000_000; // Million
const PROFIT_PERCENTAGE = env.PROFIT_PERCENTAGE || 5;
const modelKeys = ["gemini-3-pro-preview", "gemini-3-flash-preview"] as const;
interface Model {
  name: (typeof modelKeys)[number];
  getInputTokensPrice: (tokensCount: number) => number;
  getOutputTokensPrice: (tokensCount: number) => number;
}
export const models: Record<(typeof modelKeys)[number], Model> = {
  "gemini-3-pro-preview": {
    name: "gemini-3-pro-preview",
    getInputTokensPrice: (tokensCount) =>
      getTokensCostWithProfit(tokensCount, tokensCount <= 2 * 100_000 ? 2 : 4),
    getOutputTokensPrice: (tokensCount) =>
      getTokensCostWithProfit(
        tokensCount,
        tokensCount <= 2 * 100_000 ? 12 : 18,
      ),
  },
  "gemini-3-flash-preview": {
    name: "gemini-3-flash-preview",
    getInputTokensPrice: (tokensCount) =>
      getTokensCostWithProfit(tokensCount, 0.5),
    getOutputTokensPrice: (tokensCount) =>
      getTokensCostWithProfit(tokensCount, 3),
  },
} as const;

const getTokensCostWithProfit = (
  tokensCount: number,
  pricePerMil: number,
): number => {
  const baseCost = (tokensCount / MILLION) * pricePerMil;
  const profit = baseCost * (PROFIT_PERCENTAGE / 100);
  return Number((profit + baseCost).toFixed(2));
};
