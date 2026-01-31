"use client";
import {
  useMarketplaceTemplateById,
  usePurchaseTemplate,
} from "@/hooks/use-marketplace";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, CircleDollarSign, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button, buttonVariants } from "@repo/ui/components/button";
import Link from "next/link";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { toast } from "sonner";
import { useLikeChat } from "@/hooks/use-chats";

export default function ClientView() {
  const router = useRouter();
  const params = useParams();
  const {
    data: template,
    isLoading,
    isError,
  } = useMarketplaceTemplateById(params.id as string);
  const { mutate } = usePurchaseTemplate();
  const likeChat = useLikeChat();

  const handleLikeClick = (action: "like" | "unlike") => {
    const toastId = toast.loading("Processing");
    likeChat.mutate(
      {
        action,
        chatId: params.id as string,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message, { id: toastId });
        },
        onError: (e) => {
          console.log(e);
          toast.error("Something went wrong", { id: toastId });
        },
      },
    );
  };

  const handlePurchaseClick = () => {
    console.log("Purchase clicked for template:", params.id);
    mutate(params.id as string, {
      onSuccess: (res) => {
        console.log(res);
        toast.success("Template purchased successfully");
        router.push(`/chat/${res.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to purchase template");
      },
    });
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
          {template.chat.thumbnail ? (
            <Image
              fill
              src={template.chat.thumbnail}
              alt={template.chat.name}
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <span>No thumbnail available</span>
            </div>
          )}
        </div>

        <div className="">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
              {template.chat.name}
            </h1>
            {template.category && (
              <span className="bg-background text-muted-foreground rounded-md border px-3 py-1 text-sm">
                {template.category.name}
              </span>
            )}
          </div>

          {template.user && (
            <div className="mt-2 flex items-center gap-3 md:mt-3">
              <h3 className="text-muted-foreground text-sm font-medium">
                Created by
              </h3>
              <div className="flex items-center gap-3">
                {template.user.avatar ? (
                  <Image
                    src={template.user.avatar}
                    alt={`${template.user.firstName} ${template.user.lastName}`}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                    <span className="text-lg font-semibold">
                      {template.user.firstName?.[0]}
                      {template.user.lastName?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">
                    {template.user.firstName} {template.user.lastName}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center gap-2 text-lg font-semibold md:mt-12">
            <CircleDollarSign className="h-5 w-5 text-green-600" />
            <span>${template.chat.price || "0"}</span>
          </div>

          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6 md:mt-3">
            <Button
              onClick={() =>
                handleLikeClick(template.isLiked ? "unlike" : "like")
              }
              variant={"outline"}
              size={"lg"}
              className="w-full sm:w-auto"
            >
              {template.isLiked ? (
                <Heart className="h-5 w-5 text-red-500" fill="red" />
              ) : (
                <Heart className="h-5 w-5" />
              )}
              <span>{template.chat.like_count || 0} likes</span>
            </Button>

            <ConfirmationDialog
              title="Buy Template"
              description="Are you sure you want to buy this template?"
              onConfirm={() => handlePurchaseClick()}
              confirmText={`Buy $${template.chat.price}`}
            >
              <Button size={"lg"}>Buy Template</Button>
            </ConfirmationDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
