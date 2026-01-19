import { BASE_URL } from "@/lib/contants";
import { brandKitsTable } from "@repo/db";
import axios from "axios";

export const getUserBrandKits = async (): Promise<
  (typeof brandKitsTable.$inferSelect)[]
> => {
  const res = await axios.get(`${BASE_URL}/api/v1/brankits`);
  console.log(res.data.data);
  return res.data.data;
};
