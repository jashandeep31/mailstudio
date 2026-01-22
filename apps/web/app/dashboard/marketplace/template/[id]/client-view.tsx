"use client";
import { useMarketplaceTemplateById } from "@/hooks/use-marketplace";
import { useParams } from "next/navigation";
import React from "react";

export default function ClientView() {
  const params = useParams();
  const { data } = useMarketplaceTemplateById(params.id as string);
  return <div>{JSON.stringify(data)}</div>;
}
