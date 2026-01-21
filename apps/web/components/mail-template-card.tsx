import { chatsTable } from "@repo/db";
import { CircleDollarSign, Heart } from "lucide-react";
import Image from "next/image";

export const MailTemplateCard = ({
  template,
}: {
  template: typeof chatsTable.$inferSelect;
}) => {
  return (
    <div className="bg-background w-full overflow-clip rounded-md border">
      <div className="relative aspect-3/2">
        {template.thumbnail && <Image fill src={template.thumbnail} alt="" />}
      </div>
      <div className="p-2">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="truncate text-sm font-medium">{template.name}</h3>
            <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
              <CircleDollarSign className="h-4 w-4" />
              <span>{template.price}</span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {template.like_count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
