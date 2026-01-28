import { planTypeEnum } from "@repo/db";
import { env } from "./env.js";

export const getPlanInfo = (
  productId: string,
): {
  name: (typeof planTypeEnum.enumValues)[number];
  creditsCount: number;
} | null => {
  if (productId === env.DODO_PRODUCT_PRO)
    return {
      name: "pro",
      creditsCount: 10,
    };
  else if (productId === env.DODO_PRODUCT_PRO_PLUS)
    return {
      name: "pro_plus",
      creditsCount: 30,
    };
  return null;
};
