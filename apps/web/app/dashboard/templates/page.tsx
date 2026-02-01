import React from "react";
import ClientView from "./client-view";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

export default function TemplatesPage() {
  const user = getSession();
  if (!user) redirect("/login");
  return <ClientView />;
}
