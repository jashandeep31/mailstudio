import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Brand Kit</DialogTitle>
          <DialogDescription>
            Choose how you would like to create your brand kit.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
