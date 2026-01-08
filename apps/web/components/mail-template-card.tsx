import { CircleDollarSign, Heart, Users } from "lucide-react";

export const MailTemplateCard = () => {
  return (
    <div className="bg-background w-full overflow-clip rounded-md border">
      <img src="https://placehold.co/600x400" alt="" />
      <div className="p-2">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="truncate text-sm font-medium">
              Signup mail template
            </h3>
            <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
              <CircleDollarSign className="h-4 w-4" />
              <span>1 Credit</span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              4.5
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
