import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandKitSelection } from "../brand-kits/brand-kit-selection";
import { BrandKitUrlImport } from "../brand-kits/brand-kit-url-import";

type BrandKitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BrandKitDialog({ open, onOpenChange }: BrandKitDialogProps) {
  const [mode, setMode] = useState<"select" | "url">("select");
  const router = useRouter();

  const handleManualCreate = () => {
    onOpenChange(false);
    router.push("/dashboard/brand-kits/create");
  };

  return (
    <>
      <BrandKitSelection
        open={open && mode === "select"}
        onOpenChange={onOpenChange}
        onUrlImport={() => setMode("url")}
        onManualCreate={handleManualCreate}
      />
      <BrandKitUrlImport
        open={open && mode === "url"}
        onOpenChange={onOpenChange}
        onBack={() => setMode("select")}
      />
    </>
  );
}
