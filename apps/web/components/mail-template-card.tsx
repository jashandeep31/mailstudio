import { CircleDollarSign, Heart } from "lucide-react";

export const MailTemplateCard = () => {
  return (
    <div className="bg-background w-full overflow-clip rounded-md border">
      <div className="aspect-3/2">
        <img
          src="https://mailstudio-testing-public.s3.us-east-1.amazonaws.com/response.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIATCKAN5R3NGQPGZ7K%2F20260110%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260110T122756Z&X-Amz-Expires=604800&X-Amz-Signature=784645376291a9ce91f160fd9571ece0124d40d192ee377af334b61f01e384b8&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
          alt=""
        />
      </div>
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
              <Heart className="h-3.5 w-3.5" />5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
