import { getSession } from "@/lib/get-session";
import ClientView from "./client-view";
import { redirect } from "next/navigation";

export default function page() {
  const user = getSession();
  if (!user) redirect("/login");
  return <ClientView />;
}
