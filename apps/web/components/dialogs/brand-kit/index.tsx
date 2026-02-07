import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandKitSelection } from "./brand-kit-selection";
import { BrandKitUrlImport } from "./brand-kit-url-import";
import { BrandKitUpgrade } from "./brand-kit-upgrade";
import { useUserMetadata } from "@/hooks/use-user";
import { useUserBrandKits } from "@/hooks/use-brandkits";
import { getPlanInfoByType } from "@/lib/contants";

type BrandKitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BrandKitDialog({ open, onOpenChange }: BrandKitDialogProps) {
  const { data: brandKits } = useUserBrandKits();
  const { data: userMetadata } = useUserMetadata();
  const [mode, setMode] = useState<"select" | "url">("select");
  const router = useRouter();

  const handleManualCreate = () => {
    onOpenChange(false);
    router.push("/dashboard/brand-kits/create");
  };

  const isFreeUser = userMetadata?.user?.planType === "free";
  const isLimitReached =
    !isFreeUser &&
    userMetadata?.user?.planType &&
    brandKits &&
    brandKits.length >=
      getPlanInfoByType(userMetadata.user.planType as "pro" | "pro_plus")
        .brandkitsAllowed;

  if (isFreeUser || isLimitReached) {
    return (
      <BrandKitUpgrade
        open={open}
        onOpenChange={onOpenChange}
        limitReached={!!isLimitReached}
      />
    );
  }

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
