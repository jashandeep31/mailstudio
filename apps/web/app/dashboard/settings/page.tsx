import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }
  return <div>page</div>;
}
