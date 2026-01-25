import React from "react";
import {
  Sparkles,
  Store,
  Zap,
  Code2,
  LayoutTemplate,
  ArrowRight,
  Terminal,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/button";

const page = async () => {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col items-center justify-center space-y-10 overflow-hidden px-4 py-24 text-center md:py-32 lg:py-40">
        {/* Background gradient/decoration */}
        <div className="bg-background absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>

        <div className="z-10 mx-auto max-w-4xl space-y-4">
          <div className="focus:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4 inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-sky-500"></span>
            Beta Version
          </div>

          <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text pb-2 text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Design, manage, and ship <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-500">
              email templates
            </span>{" "}
            faster.
          </h1>

          <p className="text-muted-foreground mx-auto max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            Mail Studio is the API-first platform for building beautiful emails.
            Generate with AI, customize with MJML, and deploy via our global
            edge network.
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

      {/* Feature Grid */}
      <section className="container mx-auto space-y-12 py-12 md:py-24 lg:py-32">
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Zap className="h-10 w-10 text-blue-500" />
              <div className="space-y-2">
                <h3 className="font-bold">Instant Generation</h3>
                <p className="text-muted-foreground text-sm">
                  Describe your email in plain text and let our AI engine
                  generate responsive MJML code in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Code2 className="h-10 w-10 text-green-500" />
              <div className="space-y-2">
                <h3 className="font-bold">MJML & HTML Support</h3>
                <p className="text-muted-foreground text-sm">
                  Full control over the code. Edit generated templates or start
                  from scratch with real-time preview.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background relative overflow-hidden rounded-lg border p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Cpu className="h-10 w-10 text-purple-500" />
              <div className="space-y-2">
                <h3 className="font-bold">API First</h3>
                <p className="text-muted-foreground text-sm">
                  Send emails programmatically. Integrate your templates
                  directly into your application workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition / Code Section */}
      <section className="container mx-auto py-12 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-6xl">
            Built for Developers
          </h2>
          <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
            Stop wrestling with table layouts. Mail Studio handles the client
            compatibility while you focus on the content.
          </p>
        </div>

        <div className="bg-card text-card-foreground mx-auto mt-12 max-w-5xl rounded-xl border shadow">
          <div className="flex flex-col md:flex-row">
            <div className="border-border flex-1 border-b p-6 md:border-r md:border-b-0 md:p-10">
              <div className="text-muted-foreground mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                <span className="font-mono text-sm">Input</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <p className="text-blue-500">Prompt:</p>
                <p className="text-foreground/80 mt-2">
                  &quot;Create a welcome email for a SaaS product called
                  &apos;Acme&apos;. Include a hero image, a feature list, and a
                  call to action button saying &apos;Get Started&apos;.&quot;
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <ArrowRight className="text-muted-foreground h-6 w-6 rotate-90 md:rotate-0" />
            </div>
            <div className="flex-1 p-6 md:p-10">
              <div className="text-muted-foreground mb-4 flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5" />
                <span className="font-mono text-sm">Output</span>
              </div>
              <div className="space-y-2">
                <div className="bg-muted h-4 w-3/4 animate-pulse rounded"></div>
                <div className="bg-muted/50 text-muted-foreground flex h-32 w-full items-center justify-center rounded border border-dashed text-xs">
                  Email Preview
                </div>
                <div className="bg-muted h-4 w-1/2 animate-pulse rounded"></div>
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

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3">
          {/* Free Plan */}
          <div className="bg-background flex flex-col rounded-lg border p-6 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-muted-foreground">Perfect for side projects</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="my-6 flex-1 space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">50 AI generations/mo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">Community support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">Basic templates</span>
              </li>
            </ul>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", className: "w-full" }),
              )}
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-background border-primary/50 relative flex flex-col rounded-lg border p-6 shadow-sm">
            <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium">
              Popular
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-muted-foreground">For growing businesses</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$10</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="my-6 flex-1 space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">Unlimited AI generations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">Custom domains</span>
              </li>
            </ul>
            <Link
              href="/login"
              className={cn(buttonVariants({ className: "w-full" }))}
            >
              Subscribe
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-background flex flex-col rounded-lg border p-6 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <p className="text-muted-foreground">For large teams</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">Custom</span>
              </div>
            </div>
            <ul className="my-6 flex-1 space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">Dedicated infrastructure</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">SLA guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">SSO integration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">24/7 dedicated support</span>
              </li>
            </ul>
            <Link
              href="mailto:sales@mailstudio.com"
              className={cn(
                buttonVariants({ variant: "outline", className: "w-full" }),
              )}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="border-t">
        <div className="container mx-auto flex flex-col items-center gap-4 py-24 text-center md:py-32">
          <h2 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-5xl">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            Join thousands of developers building better emails today.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:px-8 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-muted-foreground text-center text-sm leading-loose text-balance md:text-left">
            Built by{" "}
            <a
              href="https://x.com/jashandeep31"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              @jashandeep31
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
};

export default page;
