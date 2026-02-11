import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/button";

export type PricingPlan = {
  name: string;
  description: string;
  price: string;
  features: string[];
  ctaLabel: string;
  ctaVariant?: "default" | "outline";
  isPopular?: boolean;
  popularLabel?: string;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for side projects",
    price: "$0",
    features: ["0 Credits", "Marketplace access to free templates"],
    ctaLabel: "Get Started",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    description: "For growing businesses",
    price: "$10",
    features: [
      "$10 worth of credits",
      "AI email template generation",
      "5 Brandkits",
      "WYSIWYG editor access (beta)",
    ],
    ctaLabel: "Subscribe",
    isPopular: true,
    popularLabel: "Popular",
  },
  {
    name: "Pro Plus",
    description: "For power users",
    price: "$30",
    features: [
      "$30 worth of credits",
      "AI email template generation",
      "10 Brandkits",
      "WYSIWYG editor access (beta)",
      "Sending newsletter (Coming Soon)",
    ],
    ctaLabel: "Subscribe",
    ctaVariant: "outline",
  },
];

interface PricingCardsProps {
  className?: string;
  ctaHref?: string;
  plans?: PricingPlan[];
}

export function PricingCards({
  className,
  ctaHref = "/login",
  plans = PRICING_PLANS,
}: PricingCardsProps) {
  return (
    <div
      className={cn(
        "mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3",
        className,
      )}
    >
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "bg-background flex flex-col rounded-lg border p-6 shadow-sm",
            plan.isPopular && "border-primary/50 relative",
          )}
        >
          {plan.isPopular ? (
            <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium">
              {plan.popularLabel || "Popular"}
            </div>
          ) : null}

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="text-muted-foreground">{plan.description}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
          </div>

          <ul className="my-6 flex-1 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="text-primary h-4 w-4" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({
                variant: plan.ctaVariant === "outline" ? "outline" : undefined,
                className: "w-full",
              }),
            )}
          >
            {plan.ctaLabel}
          </Link>
        </div>
      ))}
    </div>
  );
}
