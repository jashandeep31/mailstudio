import React from "react";
import { Metadata } from "next";
import { PricingCards } from "@/components/pricing-cards";

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
          Choose the plan that&apos;s right for you. No hidden fees.
        </p>

        <PricingCards className="text-left" />

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
