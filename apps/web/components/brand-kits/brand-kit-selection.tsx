import { Button } from "@repo/ui/components/button";
import { BrandKitDialogShell } from "./brand-kit-dialog-shell";

type BrandKitSelectionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUrlImport: () => void;
  onManualCreate: () => void;
};

export function BrandKitSelection({
  open,
  onOpenChange,
  onUrlImport,
  onManualCreate,
}: BrandKitSelectionProps) {
  return (
    <BrandKitDialogShell
      open={open}
      onOpenChange={onOpenChange}
      title="Create Brand Kit"
      description="Choose how you would like to create your brand kit."
    >
      <div className="flex flex-col gap-4 py-4">
        <Button
          variant="outline"
          className="justify-start"
          onClick={onUrlImport}
        >
          Auto Import from URL
        </Button>
        <Button
          variant="outline"
          className="justify-start"
          onClick={onManualCreate}
        >
          Manual Creation
        </Button>
      </div>
    </BrandKitDialogShell>
  );
}
