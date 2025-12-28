import React from "react";
import ClientView from "./client-view";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function page() {
  const session = getSession();
  if (!session) redirect("/login");
  return <ClientView />;
}
