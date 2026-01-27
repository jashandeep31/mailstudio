import { Loader2 } from "lucide-react";
import React from "react";

const CommonLoader = () => {
  return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  );
};

export default CommonLoader;
