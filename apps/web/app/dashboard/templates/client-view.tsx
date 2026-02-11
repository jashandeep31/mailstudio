"use client";

import React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { DashboardTemplateCard } from "@/components/dashboard-template-card";
import {
  useInfiniteChats,
  useDeleteChat,
  useCloneChat,
} from "@/hooks/use-chats";
import Link from "next/link";
import CommonLoader from "@/components/common-loader";

export default function ClientView() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteChats();
  const { mutate: deleteTemplate } = useDeleteChat();
  const { mutate: cloneTemplate } = useCloneChat();

  const handleDuplicate = (id: string) => {
    cloneTemplate({ chatId: id });
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
  };

  if (isLoading) return <CommonLoader />;

  return (
    <div className="mx-3 mt-3 md:mx-12 md:mt-12 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between md:flex-row">
        <div className="">
          <h1 className="text-lg font-semibold tracking-tight md:text-xl lg:text-3xl">
            My Templates
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage and edit your email designs.
          </p>
        </div>
        <div className="my-6 flex justify-end md:my-auto md:justify-start">
          <Link href="/dashboard" className={buttonVariants()}>
            <Plus className="h-4 w-4" />
            New Template
          </Link>
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {data?.pages.map((page) =>
          page?.map((template) => (
            <DashboardTemplateCard
              key={template.id}
              id={template.id}
              name={template.name}
              thumbnail={template.thumbnail || undefined}
              lastModified={new Date(template.updated_at).toLocaleDateString()}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          )),
        )}
      </div>

      {/* Empty State */}
      {!isLoading && data?.pages.flat().length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No templates found. Create one to get started!
          </p>
        </div>
      )}

      {/* Load More */}
      {!isLoading && data?.pages.flat().length !== 0 && (
        <div className="mt-12 flex items-center justify-center">
          <Button
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
            className="min-w-40"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : !hasNextPage ? (
              "You've reached the end"
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
