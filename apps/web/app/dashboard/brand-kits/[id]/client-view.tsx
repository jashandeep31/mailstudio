"use client";

import CreateOrUpdateBrandKitForm from "@/components/brand-kits/create-or-update-brand-kit-form";
import { useUserBrandKitById } from "@/hooks/use-brandkits";
import { useParams } from "next/navigation";

export default function ClientView() {
  const params = useParams();
  const brandKitRes = useUserBrandKitById(params.id as string);
  if (brandKitRes.isLoading) return <h1>Loading ..</h1>;

  if (brandKitRes.error || !brandKitRes.data)
    return <h1>Something went wrong </h1>;
  return (
    <div className="mx-3 mt-3 mb-12 md:mx-12 md:mt-12">
      <h1 className="mb-8 text-2xl font-semibold">Edit Brand Kit</h1>
      <CreateOrUpdateBrandKitForm defaultValues={brandKitRes.data} />
    </div>
  );
}
