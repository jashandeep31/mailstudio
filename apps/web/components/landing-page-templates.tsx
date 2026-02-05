"use client";

import React from "react";
import { useInfiniteMarkeplaceTemplates } from "@/hooks/use-marketplace";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import { ArrowRight } from "lucide-react";
import { chatsTable } from "@repo/db";
import { Skeleton } from "@repo/ui/components/skeleton";

const LandingTemplateCard = ({
  template,
}: {
  template: typeof chatsTable.$inferSelect;
}) => {
  return (
    <div className="bg-background group relative overflow-hidden rounded-xl border transition-all hover:shadow-lg">
      <div className="bg-muted relative aspect-[3/2] overflow-hidden">
        {template.thumbnail ? (
          <Image
            src={template.thumbnail}
            alt={template.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            No Preview
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold tracking-tight">{template.name}</h3>
        <p className="text-muted-foreground mt-1 text-sm capitalize">
          {template.price === "0.00" ? "Free" : `$${template.price}`}
        </p>
      </div>
    </div>
  );
};

const TemplateSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-3/2] w-full rounded-xl" />
    <div className="space-y-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

export function LandingPageTemplates() {
  const { data, isLoading } = useInfiniteMarkeplaceTemplates({ limit: 3 });

  // Get first 3 templates from the first page
  const displayedTemplates = data?.pages.flat().slice(0, 3) || [];

  if (!isLoading && !displayedTemplates.length) return null;

  return (
    <section className="container mx-auto space-y-12 py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-232 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl leading-[1.1] font-bold sm:text-3xl md:text-6xl">
          Start with a template
        </h2>
        <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          Choose from our collection of professionally designed templates to
          jumpstart your email marketing.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {isLoading
          ? Array(3)
              .fill(0)
              .map((_, i) => <TemplateSkeleton key={i} />)
          : displayedTemplates.map((template) => (
              <LandingTemplateCard key={template.id} template={template} />
            ))}
      </div>

      <div className="flex justify-center">
        <Link href="/login">
          <Button size="lg" variant="outline" className="gap-2">
            Access Marketplace <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
