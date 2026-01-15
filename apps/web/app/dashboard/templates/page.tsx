"use client";

import React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@repo/ui/components/button";
import { DashboardTemplateCard } from "@/components/dashboard-template-card";
import { toast } from "sonner";
import { useChats, useDeleteChat } from "@/hooks/use-chats";
import Link from "next/link";

export default function TemplatesPage() {
  const { data: templates, isLoading } = useChats();
  const { mutate: deleteTemplate } = useDeleteChat();

  const handleDuplicate = (id: string) => {
    toast.info(`Duplicate feature coming soon for ${id}`);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            My Templates
          </h1>
          <p className="text-muted-foreground">
            Manage and edit your email designs.
          </p>
        </div>
        <Link href="/dashboard" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          New Template
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {templates?.map((template) => (
          <DashboardTemplateCard
            key={template.id}
            id={template.id}
            name={template.name}
            thumbnail={template.thumbnail || undefined}
            lastModified={new Date(template.updated_at).toLocaleDateString()}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        ))}

        {/* Empty State */}
        {templates?.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">
              No templates found. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
