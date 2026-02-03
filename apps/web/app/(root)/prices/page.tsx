import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Choose the plan that works for you.",
};

const PricingPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <section className="container mx-auto flex flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <h1 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-6xl">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          Choose the plan that's right for you. No hidden fees.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 px-4 text-left md:grid-cols-3">
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
                <span className="text-sm">0 Credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">
                  Marketplace access to free templates
                </span>
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
                <span className="text-sm">$10 worth of credits</span>
              </li>{" "}
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">AI mail templates generation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">5 Brandkits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">
                  WYSIWYG editor access (Coming soon)
                </span>
              </li>
            </ul>
            <Link
              href="/login"
              className={cn(buttonVariants({ className: "w-full" }))}
            >
              Subscribe
            </Link>
          </div>

          {/* Pro Plus Plan */}
          <div className="bg-background flex flex-col rounded-lg border p-6 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Pro Plus</h3>
              <p className="text-muted-foreground">For power users</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$30</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
            </div>
            <ul className="my-6 flex-1 space-y-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">$30 worth of credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">AI mail templates generation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">10 Brandkits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">
                  WYSIWYG editor access (Coming soon)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">
                  Sending newsletter (Coming Soon)
                </span>
              </li>
            </ul>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", className: "w-full" }),
              )}
            >
              Subscribe
            </Link>
          </div>
        </div>

        <div className="mt-16 max-w-2xl text-center">
          <p className="text-muted-foreground text-sm">
            Prices are subject to change. For enterprise inquiries, please
            contact sales.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
