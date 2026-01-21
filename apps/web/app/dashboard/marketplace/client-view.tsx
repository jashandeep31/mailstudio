"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

import { MailTemplateCard } from "@/components/mail-template-card";
import { useMarketplaceTemplates } from "@/hooks/use-marketplace";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/use-utils";

export default function ClientView() {
  const { data: templates, isLoading } = useMarketplaceTemplates();
  const { data: categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const types = [
    { id: "all", label: "All" },
    { id: "free", label: "Free" },
    { id: "premium", label: "Premium" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with Search */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Mail Template Marketplace</h1>
        </div>
        <div className="relative max-w-md lg:max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="mb-3 text-sm font-medium">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">Type</h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates?.map((template) => (
          <MailTemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
