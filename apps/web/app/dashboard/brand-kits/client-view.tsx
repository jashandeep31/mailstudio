"use client";
import { useDeleteBrandKit, useUserBrandKits } from "@/hooks/use-brandkits";
import React, { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import { BrandKitDialog } from "@/components/dialogs/brand-kit";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { toast } from "sonner";
import Image from "next/image";
import CommonLoader from "@/components/common-loader";

export default function ClientView() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const brandkitsRes = useUserBrandKits();
  const { mutate: deleteBrandKit } = useDeleteBrandKit();

  const handleDelete = (id: string) => {
    const toastId = toast.loading("Deleting brand kit...");
    deleteBrandKit(id, {
      onSuccess: () => {
        toast.success("Brand kit deleted successfully", { id: toastId });
      },
      onError: () => {
        toast.error("Failed to delete brand kit", { id: toastId });
      },
    });
  };
  if (brandkitsRes.isLoading) {
    return <CommonLoader />;
  }
  return (
    <>
      <div className="mx-3 mt-3 md:mx-12 md:mt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight md:text-xl lg:text-3xl">
            My Brand kits
          </h1>
          <Button onClick={() => setDialogOpen(true)}>+ Brand Kit</Button>
          <BrandKitDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
        <div className="mt-4 md:mt-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {brandkitsRes?.data?.map((brandKit) => (
              <div
                className="bg-background flex aspect-3/2 flex-col rounded-lg border p-3"
                key={brandKit.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1" />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="relative z-10 focus:outline-none">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/brand-kits/${brandKit.id}`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <ConfirmationDialog
                        title="Delete Brand Kit"
                        description="Are you sure you want to delete this brand kit?"
                        onConfirm={() => handleDelete(brandKit.id)}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </ConfirmationDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Link
                  href={`/dashboard/brand-kits/${brandKit.id}`}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex flex-1 items-center justify-center">
                    {brandKit.logo_url ? (
                      <div className="relative h-30 w-30 overflow-hidden rounded-lg">
                        <Image
                          fill
                          src={brandKit.logo_url}
                          alt={brandKit.name}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted flex h-30 w-30 items-center justify-center rounded-lg text-2xl font-semibold uppercase">
                        {brandKit.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center text-sm font-medium">
                    {brandKit.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
