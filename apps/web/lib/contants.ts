export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

import { planTypeEnum } from "@repo/db";

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
export const getPlanInfoByType = (slug: keyof typeof plans): Plan => {
  if (slug === "pro") return plans.pro;
  else return plans.pro_plus;
};
