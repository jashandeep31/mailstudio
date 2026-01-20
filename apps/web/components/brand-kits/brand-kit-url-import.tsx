import { useCreateBrandKit } from "@/hooks/use-brandkits";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Loader } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

type BrandKitUrlImportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
};

export function BrandKitUrlImport({
  open,
  onOpenChange,
  onBack,
}: BrandKitUrlImportProps) {
  const { mutate, isPending } = useCreateBrandKit();
  const [url, setUrl] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  const handleSubmit = () => {
    if (!url.trim()) return;
    const toastId = toast.loading("Importing brand kit...");
    mutate(
      { websiteUrl: url },
      {
        onSuccess: () => {
          toast.success("Brand kit imported successfully", { id: toastId });
          setUrl("");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to import brand kit", { id: toastId });
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isPending) {
      handleSubmit();
    }
  };

  const getLoadingMessage = () => {
    if (elapsedTime < 10) return "Analyzing website...";
    if (elapsedTime < 25) return "Extracting brand colors...";
    if (elapsedTime < 40) return "Detecting logos and assets...";
    return "Almost there, finalizing...";
  };

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent onInteractOutside={(e) => isPending && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Import Brand Kit from URL</DialogTitle>
          <DialogDescription>
            Enter the website URL to automatically import brand colors and
            assets.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUrl(e.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={isPending}
            autoFocus
          />
          {isPending && (
            <div className="bg-muted/50 mt-4 flex flex-col items-center gap-3 rounded-lg border p-4">
              <Loader className="text-primary h-6 w-6 animate-spin" />
              <p className="text-sm font-medium">{getLoadingMessage()}</p>
              <p className="text-muted-foreground text-xs">
                This may take up to 1 minute
              </p>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((elapsedTime / 60) * 100, 95)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onBack} disabled={isPending}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !url.trim()}>
            {isPending ? (
              <>
                Importing <Loader className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
