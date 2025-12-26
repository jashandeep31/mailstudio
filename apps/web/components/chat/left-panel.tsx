import { ResizablePanel } from "@repo/ui/components/resizable";
import React from "react";
import InputArea from "./input-area";
import { Button } from "@repo/ui/components/button";
import { Copy, PencilLine } from "lucide-react";

export default function LeftPanel() {
  return (
    <ResizablePanel className="flex flex-col p-3" defaultSize={"25%"}>
      <div className="flex-1">
        <UserChatBubble />
        <div className="mt-3">
          <p className="text-muted-foreground text-sm font-bold">Working..</p>
          <p className="text-muted-foreground mt-1 text-sm">
            I&apos;ll create a login page inspired by the Apollo.io design you
            shared. Let me first understand your codebase structure, then build
            the login page component.
          </p>
        </div>
      </div>
      <InputArea />
    </ResizablePanel>
  );
}

const UserChatBubble = () => {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="bg-muted max-w-[75%] rounded-md border p-2 text-sm">
        Create the mail template that i can use to hte enable the things
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
