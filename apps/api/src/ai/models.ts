
const MILLION = 1_000_000// Million
const PROFIT_PERCENTAGE = 5


interface Model {
  name: string;
  getInputTokensPrice: (tokensCount: number) => number
  getOutputTokensPrice: (tokensCount: number) => number
}

export const models: Record<'gemini-3-pro-preview', Model> = {
  'gemini-3-pro-preview': {
    name: "gemini-3-pro-preview",
    getInputTokensPrice: (tokensCount: number): number => {
      if (tokensCount <= 2 * 100_000) return getTokensCostWithProfit(tokensCount, 2.00,)
      else return getTokensCostWithProfit(tokensCount, 4.00)
    },
    getOutputTokensPrice: (tokensCount: number): number => {
      if (tokensCount <= 2 * 100_000) return getTokensCostWithProfit(tokensCount, 12.00)
      else return getTokensCostWithProfit(tokensCount, 18)
    }
  }
} as const

const getTokensCostWithProfit = (tokensCount: number, pricePerMil: number,): number => {
  const baseCost = (tokensCount / MILLION) * pricePerMil
  const profit = baseCost * (PROFIT_PERCENTAGE / 100)
  return Number((profit + baseCost).toFixed(2))
}
