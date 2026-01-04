import { Button } from "@repo/ui/components/button";
import { useChatStore } from "@/zustand-store/chat-store";
import { ResizablePanel } from "@repo/ui/components/resizable";
import { Monitor, Smartphone, TabletSmartphone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useState } from "react";
import { ChatTopControlBar } from "./chat-top-control-bar";
import { CodeView } from "./code-view";
import { MailTemplatePreviewer } from "./mail-template-preivewer";

export const RightPanel = (props: {}) => {
  const [view, setView] = useState<"code" | "preview">("code");
  // store
  const selectedVersion = useChatStore((s) => s.selectedVersion);
  const activeStream = useChatStore((s) => s.activeStream);
  if (!selectedVersion) {
    return <h1>please selet the version</h1>;
  }
  const handleCopyHtml = () => {
    navigator.clipboard.writeText(
      selectedVersion.chat_version_outputs?.html_code || "",
    );
  };
  return (
    <ResizablePanel defaultSize={"75%"} className="grid">
      <div className="flex h-full flex-col justify-center">
        <ChatTopControlBar view={view} setView={setView} />
        <div className="grid flex-1">
          {view === "preview" ? (
            <MailTemplatePreviewer
              html={selectedVersion.chat_version_outputs?.html_code}
            />
          ) : (
            <CodeView html={selectedVersion.chat_version_outputs?.html_code} />
          )}
        </div>
      </div>
    </ResizablePanel>
  );
};
