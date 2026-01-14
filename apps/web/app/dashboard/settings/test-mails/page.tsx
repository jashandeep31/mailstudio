import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import ClientView from "./client-view";

export default async function TestMailsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return <ClientView />;
}
