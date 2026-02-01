"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { MailTemplateCard } from "@/components/mail-template-card";
import { useMarketplaceTemplates } from "@/hooks/use-marketplace";
import { useCategories } from "@/hooks/use-utils";
import CommonLoader from "@/components/common-loader";

export default function ClientView() {
  const { data: categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Getting the filtered data from the backend api
  const { data: templates, isLoading } = useMarketplaceTemplates({
    categoryId: selectedCategoryId === "all" ? undefined : selectedCategoryId,
    type: selectedType === "all" ? undefined : selectedType,
  });

  const types = [
    { id: "all", label: "All" },
    { id: "free", label: "Free" },
    { id: "premium", label: "Premium" },
  ];

  return (
    <div className="container mt-6 md:mt-12">
      {/* Header with Search */}
      <div className="mb-3 flex flex-col gap-4 md:mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-muted-foreground text-lg font-semibold tracking-tight md:text-xl lg:text-3xl">
            Marketplace
          </h2>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 space-y-4 md:mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                key={"all"}
                variant={selectedCategoryId === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategoryId("all")}
              >
                All
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategoryId === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">
              Type
            </h3>
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

      {isLoading && <CommonLoader />}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {templates?.map((template) => (
          <MailTemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
