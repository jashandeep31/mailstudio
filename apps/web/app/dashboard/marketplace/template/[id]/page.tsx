import React from "react";
import ClientView from "./client-view";
import { getSession } from "@/lib/get-session";

export default async function page() {
  const session = await getSession();
  return <ClientView session={session} />;
}
