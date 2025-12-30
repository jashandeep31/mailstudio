import { ResizablePanel } from "@repo/ui/components/resizable";
import React from "react";
import { Button } from "@repo/ui/components/button";
import { Copy, PencilLine } from "lucide-react";
import { Version } from "@/app/chat/[id]/client-view";

interface LeftPanel {
  versions: Version[];
}
export default function LeftPanel({ versions }: LeftPanel) {
  return (
    <ResizablePanel className="flex flex-col p-3" defaultSize={"25%"}>
      {versions.map((version) => (
        <div className="flex-1" key={version.chat_versions.id}>
          {version.chat_version_prompts && (
            <UserChatBubble message={version.chat_version_prompts.prompt} />
          )}
          <div className="mt-3">
            <p className="text-muted-foreground text-sm font-bold">Working..</p>
            <p className="text-muted-foreground mt-1 text-sm">
              I&apos;ll create a login page inspired by the Apollo.io design you
              shared. Let me first understand your codebase structure, then
              build the login page component.
            </p>
          </div>
        </div>
      ))}
      {/* <InputArea /> */}
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
