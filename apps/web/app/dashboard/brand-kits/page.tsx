import { getSession } from "@/lib/get-session";
import ClientView from "./client-view";
import { redirect } from "next/navigation";

export default async function page() {
  const user = await getSession();
  if (!user) redirect("/login");
  return <ClientView />;
}
