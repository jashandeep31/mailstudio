import { planTypeEnum } from "@repo/db";
import { env } from "./env.js";

interface Plan {
  name: (typeof planTypeEnum.enumValues)[number];
  creditsCount: number;
  brandkitsAllowed: number;
}
const plans = {
  pro: {
    name: "pro",
    creditsCount: 10,
    brandkitsAllowed: 5,
  },
  pro_plus: {
    name: "pro_plus",
    creditsCount: 30,
    brandkitsAllowed: 10,
  },
} as const;
export const getPlanInfo = (productId: string): Plan | null => {
  if (productId === env.DODO_PRODUCT_PRO) return plans.pro;
  else if (productId === env.DODO_PRODUCT_PRO_PLUS) return plans.pro_plus;
  return null;
};

export const getPlanInfoByType = (slug: keyof typeof plans): Plan => {
  if (slug === "pro") return plans.pro;
  else return plans.pro_plus;
};
