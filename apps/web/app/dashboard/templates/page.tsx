"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { DashboardTemplateCard } from "@/components/dashboard-template-card";
import { toast } from "sonner";

// Mock Data
const MOCK_TEMPLATES = [
  {
    id: "1",
    name: "Welcome Onboarding",
    thumbnail:
      "https://mailstudio-testing-public.s3.us-east-1.amazonaws.com/response.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATCKAN5R3NGQPGZ7K%2F20260110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260110T122756Z&X-Amz-Expires=604800&X-Amz-Signature=784645376291a9ce91f160fd9571ece0124d40d192ee377af334b61f01e384b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    lastModified: "2 days ago",
  },
  {
    id: "2",
    name: "Weekly Newsletter",
    thumbnail:
      "https://mailstudio-testing-public.s3.us-east-1.amazonaws.com/response.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATCKAN5R3NGQPGZ7K%2F20260110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260110T122756Z&X-Amz-Expires=604800&X-Amz-Signature=784645376291a9ce91f160fd9571ece0124d40d192ee377af334b61f01e384b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    lastModified: "1 week ago",
  },
  {
    id: "3",
    name: "Product Launch v2",
    thumbnail: "", // Test empty state
    lastModified: "Just now",
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);

  const handleDuplicate = (id: string) => {
    toast.success(`Duplicated template ${id}`);
    // Mock duplication logic
    const template = templates.find((t) => t.id === id);
    if (template) {
      setTemplates([
        ...templates,
        {
          ...template,
          id: Date.now().toString(),
          name: `${template.name} (Copy)`,
        },
      ]);
    }
  };

  const handleDelete = (id: string) => {
    toast.success(`Deleted template ${id}`);
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleRename = (id: string) => {
    toast.info(`Rename triggered for ${id}`);
  };

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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {templates.map((template) => (
          <DashboardTemplateCard
            key={template.id}
            id={template.id}
            name={template.name}
            thumbnail={template.thumbnail}
            lastModified={template.lastModified}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}

        {/* Empty State */}
        {templates.length === 0 && (
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
