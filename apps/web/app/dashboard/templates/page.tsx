import React from "react";
import ClientView from "./client-view";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

export default async function TemplatesPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  return <ClientView />;
}
