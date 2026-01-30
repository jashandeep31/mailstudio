import { ChatVersionAggregate } from "@/app/chat/[id]/types";
import { useChatStore } from "@/zustand-store/chat-store";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { SendTestMailDropdown } from "./send-test-mail-dropdown";
import { Monitor, Smartphone } from "lucide-react";
import React from "react";

interface ChatTopControlBar {
  view: "preview" | "code" | "edit";
  setView: React.Dispatch<React.SetStateAction<"code" | "preview" | "edit">>;
  chatVersions: ChatVersionAggregate[];
  iframeWidth: number;
  setIframeWidth: React.Dispatch<React.SetStateAction<number>>;
}
export const ChatTopControlBar = ({
  chatVersions,
  view,
  setView,
  iframeWidth,
  setIframeWidth,
}: ChatTopControlBar) => {
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);
  const setSelectedVersionId = useChatStore((s) => s.setSelectedVersionId);

  return (
    <div className="flex w-full items-center justify-between border-b p-1">
      <div className="hidden flex-1 md:block">
        <div className="bg-muted inline-flex rounded-md p-1">
          <Button
            variant={view === "preview" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setView("preview")}
          >
            Preview
          </Button>
          <Button
            variant={view === "code" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setView("code")}
          >
            Code
          </Button>
          {/* <Button
            variant={view === "edit" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setView("edit")}
          >
            Edit
          </Button> */}
        </div>
      </div>

      <div>
        {view === "preview" && (
          <div className="inline-flex rounded-md p-1">
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => setIframeWidth(350)}
            >
              <Smartphone />
            </Button>
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => setIframeWidth(700)}
            >
              <Monitor />
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        {view === "preview" && (
          <>
            <Select
              value={selectedVersionId ?? undefined}
              onValueChange={(e) => {
                setSelectedVersionId(e);
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Version" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {chatVersions.map((version) => (
                    <SelectItem
                      key={version.chat_versions.id}
                      value={version.chat_versions.id}
                    >
                      V{version.chat_versions.version_number}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <SendTestMailDropdown />
          </>
        )}
      </div>
    </div>
  );
};
