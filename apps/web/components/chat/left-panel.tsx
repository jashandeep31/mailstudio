import { ResizablePanel } from "@repo/ui/components/resizable";
import React from "react";
import { Button } from "@repo/ui/components/button";
import { Copy, PencilLine } from "lucide-react";
import { StreamingOverview } from "@/app/chat/[id]/client-view";
import { ChatVersionAggregate } from "@/app/chat/[id]/types";

interface LeftPanel {
  versions: ChatVersionAggregate[];
  streamingOverview: StreamingOverview;
}
export default function LeftPanel({ versions, streamingOverview }: LeftPanel) {
  return (
    <ResizablePanel className="flex flex-col p-3" defaultSize={"25%"}>
      {versions.map((version) => (
        <div className="flex-1" key={version.chat_versions.id}>
          {version.chat_version_prompts && (
            <UserChatBubble message={version.chat_version_prompts.prompt} />
          )}

          {streamingOverview?.versionId === version.chat_versions.id &&
            !version.chat_version_outputs && (
              <div className="mt-3">
                <p className="text-muted-foreground text-sm font-bold">
                  Working..
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {streamingOverview.response}
                </p>
              </div>
            )}
          <div className="mt-3">
            {version.chat_version_outputs && (
              <p className="text-muted-foreground mt-1 text-sm">
                {version.chat_version_outputs.overview}
              </p>
            )}
          </div>
        </div>
      ))}
    </ResizablePanel>
  );
}

interface UserChatBubble {
  message: string;
}
const UserChatBubble = ({ message }: UserChatBubble) => {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="bg-muted max-w-[75%] rounded-md border p-2 text-sm">
        {message}
      </div>
      <div className="flex justify-end gap-1">
        <Button variant={"ghost"} size={"sm"}>
          <PencilLine />
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          <Copy />
        </Button>
      </div>
    </div>
  );
};
