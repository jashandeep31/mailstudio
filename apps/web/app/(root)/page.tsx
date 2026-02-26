import React from "react";
import {
  Sparkles,
  Store,
  Zap,
  Code2,
  LayoutTemplate,
  CheckCircle2,
  FileCode,
  Globe,
} from "lucide-react";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/button";

import { LandingPageTemplates } from "@/components/landing-page-templates";
import { PricingCards } from "@/components/pricing-cards";

const pageTitle = "AI Email Template Builder with MJML and HTML Output";
const pageDescription =
  "Generate full email templates with AI, get both MJML and HTML instantly, and fine-tune designs in a WYSIWYG editor.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "ai email template builder",
    "mjml email generator",
    "html email generator",
    "wysiwyg email editor",
    "responsive email templates",
  ],
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

const page = async () => {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <section className="relative flex flex-1 flex-col items-center justify-center space-y-10 overflow-hidden px-4 py-24 text-center md:py-32 lg:py-40">
        <div className="bg-background absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

        <div className="z-10 mx-auto max-w-4xl space-y-4">
          <div className="focus:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4 inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-sky-500"></span>
            AI Email Template Builder
          </div>

          <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text pb-2 text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Generate complete email templates <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-500">
              with AI
            </span>{" "}
            in seconds.
          </h1>

          <p className="text-muted-foreground mx-auto max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            MailStudio creates responsive templates from a prompt, then returns
            both MJML and HTML so you can ship faster or keep editing visually
            in our WYSIWYG builder.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              <Sparkles className="h-4 w-4" /> Start Generating
            </Link>
            <Link
              href="/marketplace"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2",
              )}
            >
              <Store className="h-4 w-4" /> Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="container mx-auto py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border bg-black shadow-2xl">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/o7F_CCkTKlk?si=IQMylCmL2Vuq9ltR"
              title="MailStudio Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto space-y-12 py-12 md:py-24 lg:py-32">
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Zap className="h-10 w-10 text-blue-500" />
              <div className="space-y-2">
                <h3 className="font-bold">Instant Generation with AI</h3>
                <p className="text-muted-foreground text-sm">
                  Describe your campaign in plain text and generate complete,
                  responsive email templates in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Code2 className="h-10 w-10 text-green-500" />
              <div className="space-y-2">
                <h3 className="font-bold">MJML + HTML Output</h3>
                <p className="text-muted-foreground text-sm">
                  Get clean MJML and rendered HTML for every generation. Use
                  the output directly in your sending pipeline.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <LayoutTemplate className="h-10 w-10 text-purple-500" />
              <div className="space-y-2">
                <h3 className="font-bold">WYSIWYG Editor</h3>
                <p className="text-muted-foreground text-sm">
                  Fine-tune layouts visually with true What-You-See-Is-What-You-Get
                  editing, then export when you are ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingPageTemplates />

      {/* No Lock-in Section */}
      <section className="container mx-auto space-y-12 py-12 md:py-24 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-5xl">
              You own your code
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Don&apos;t get stuck in a closed builder. Generate with AI, edit
              visually, and keep full ownership of the final code.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="text-muted-foreground flex items-center gap-2">
                <FileCode className="text-primary h-5 w-5" />
                <span>Export full template output as MJML and HTML</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                <span>Responsive on Gmail, Outlook, and Apple Mail</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2">
                <Globe className="text-primary h-5 w-5" />
                <span>
                  Host images on our Global Edge Network or your CDN (soon)
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-muted flex min-h-[300px] items-center justify-center rounded-xl border p-8 lg:min-h-[400px]">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background flex flex-col items-center justify-center gap-2 rounded-lg border p-6 shadow-sm">
                <FileCode className="h-8 w-8 text-orange-500" />
                <span className="font-semibold">MJML</span>
              </div>
              <div className="bg-background flex flex-col items-center justify-center gap-2 rounded-lg border p-6 shadow-sm">
                <FileCode className="h-8 w-8 text-blue-500" />
                <span className="font-semibold">HTML</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-6xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
            Choose the plan that&apos;s right for you
          </p>
        </div>

        <PricingCards />
      </section>

      {/* Simple CTA */}
      <section className="">
        <div className="container mx-auto flex flex-col items-center gap-4 py-24 text-center md:py-32">
          <h2 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-5xl">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            Start with a prompt, generate MJML + HTML, and finish in the
            visual editor.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
