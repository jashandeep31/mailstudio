"use client";

import CreateOrUpdateBrandKitForm from "@/components/brand-kits/create-or-update-brand-kit-form";

export default function ClientView() {
  return (
    <div className="mx-3 mt-3 md:mx-6 md:mt-12">
      <h1 className="mb-3 text-lg font-bold md:mb-6 md:text-2xl">
        Create Brand Kit
      </h1>
      <CreateOrUpdateBrandKitForm />
    </div>
  );
}
