import { Skeleton } from "@repo/ui/components/skeleton";

export const MailTemplateCardSkeleton = () => {
  return (
    <div className="bg-background block w-full overflow-clip rounded-md border">
      <div className="relative aspect-3/2">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-2">
        <div>
          <div className="flex items-center justify-between gap-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-8" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};
