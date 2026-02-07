import { Button } from "@repo/ui/components/button";
import { useRouter } from "next/navigation";
import { BrandKitDialogShell } from "./brand-kit-dialog-shell";

type BrandKitUpgradeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitReached?: boolean;
};

export function BrandKitUpgrade({
  open,
  onOpenChange,
  limitReached = false,
}: BrandKitUpgradeProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push("/dashboard/settings/billings");
  };

  return (
    <BrandKitDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={limitReached ? "Brand Kit Limit Reached" : "Upgrade Plan"}
      description=""
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade}>Upgrade Plan</Button>
        </div>
      }
    >
      <div className="py-4">
        <div className="text-muted-foreground text-sm">
          {limitReached
            ? "You've reached the maximum number of brand kits allowed on your current plan. Please upgrade your plan to create more."
            : "Please upgrade to Pro or Pro plus to import or create new Brand kits."}
        </div>
      </div>
    </BrandKitDialogShell>
  );
}
