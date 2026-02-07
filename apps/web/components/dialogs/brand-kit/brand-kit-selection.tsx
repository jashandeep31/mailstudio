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
          className="text-center"
          size="lg"
          onClick={onUrlImport}
        >
          Auto Import from URL
          <span className="text-muted-foreground text-xs">(recommended)</span>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-center"
          onClick={onManualCreate}
        >
          Manual Creation
        </Button>
      </div>
    </BrandKitDialogShell>
  );
}
