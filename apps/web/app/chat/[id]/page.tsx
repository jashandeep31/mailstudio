import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import React from "react";
import ClientView from "./client-view";

async function page() {
  const session = await getSession();
  if (!session) redirect("/");
  return <ClientView />;
}

export default page;
