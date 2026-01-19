"use client";
import { useUserBrandKits } from "@/hooks/use-brandkits";
import React from "react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import Link from "next/link";

export default function ClientView() {
  const brandkitsRes = useUserBrandKits();
  if (brandkitsRes.isLoading) {
    return <h1>Loading..</h1>;
  }
  return (
    <div className="p-5">
      <h1 className="text-lg font-semibold tracking-tight md:text-xl lg:text-3xl">
        My Brand kits
      </h1>
      <div className="mt-4 md:mt-4">
        <div className="md:grid-col-2 grid-col-1 grid grid-cols-4">
          {brandkitsRes?.data?.map((brandKit) => (
            <div
              className="bg-background flex aspect-3/2 flex-col rounded-lg border p-3"
              key={brandKit.id}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1" />
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/brand-kits/${brandKit.id}`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-1 items-center justify-center">
                {brandKit.logo_url ? (
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={brandKit.logo_url}
                      alt={brandKit.name}
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-lg text-2xl font-semibold uppercase">
                    {brandKit.name[0]}
                  </div>
                )}
              </div>
              <div className="mt-2 text-center text-sm font-medium">
                {brandKit.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
