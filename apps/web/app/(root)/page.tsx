import React from "react";
import { Sparkles, Store } from "lucide-react";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
const page = async () => {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:py-32">
      <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Design, manage, and ship email templates — faster.
        </h1>

        <p className="text-muted-foreground max-w-[42rem] sm:text-xl">
          Mail Studio is an API-first platform and marketplace for HTML & MJML
          email templates.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <button className="bg-foreground text-background flex items-center gap-2 rounded px-5 py-2">
            <Sparkles className="h-4 w-4" /> Genetrate AI
          </button>
          <button className="bg-background text-foreground flex items-center gap-2 rounded border px-5 py-2">
            <Store className="h-4 w-4" /> Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
