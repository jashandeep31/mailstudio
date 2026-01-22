"use client";
import { useMarketplaceTemplateById } from "@/hooks/use-marketplace";
import { useParams } from "next/navigation";
import React from "react";
import { ArrowLeft, CircleDollarSign, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button, buttonVariants } from "@repo/ui/components/button";
import Link from "next/link";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";

export default function ClientView() {
  const params = useParams();
  const {
    data: template,
    isLoading,
    isError,
  } = useMarketplaceTemplateById(params.id as string);

  const handleLikeClick = () => {
    console.log("Like clicked for template:", params.id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-3 mt-3 md:mx-12 md:mt-12">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href={"/dashboard/marketplace"}
        >
          <ArrowLeft /> Back
        </Link>
        <div className="mt-12 flex items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading template...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (isError || !template) {
    return (
      <div className="mx-3 mt-3 md:mx-12 md:mt-12">
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href="/dashboard/marketplace"
        >
          <ArrowLeft /> Back
        </Link>
        <div className="mt-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-muted-foreground text-2xl font-semibold">
              Template Not Found
            </h2>
            <p className="text-muted-foreground mt-2">
              The template you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main layout
  return (
    <div className="mx-3 mt-3 md:mx-12 md:mt-12">
      <Link
        className={buttonVariants({ variant: "ghost" })}
        href="/dashboard/marketplace"
      >
        <ArrowLeft /> Back
      </Link>
      <div className="mt-4 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
        <div className="bg-muted relative aspect-3/2 overflow-hidden rounded-lg border">
          {template.thumbnail ? (
            <Image
              fill
              src={template.thumbnail}
              alt={template.name}
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <span>No thumbnail available</span>
            </div>
          )}
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
              {template.name}
            </h1>
            <span className="bg-background text-muted-foreground rounded-md border px-3 py-1 text-sm">
              Authentication
            </span>
          </div>

          <div className="flex items-center gap-2 text-lg font-semibold">
            <CircleDollarSign className="h-5 w-5 text-green-600" />
            <span>${template.price || "0"}</span>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Button
              onClick={handleLikeClick}
              variant={"outline"}
              size={"lg"}
              className="w-full sm:w-auto"
            >
              <Heart className="h-5 w-5" />
              <span>{template.like_count || 0} likes</span>
            </Button>

            <ConfirmationDialog
              title="Buy Template"
              description="Are you sure you want to buy this template?"
              onConfirm={() => {}}
              confirmText={`Buy $${template.price}`}
            >
              <Button size={"lg"}>Buy Template</Button>
            </ConfirmationDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
