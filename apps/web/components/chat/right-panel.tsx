import { useChatStore } from "@/zustand-store/chat-store";
import { ResizablePanel } from "@repo/ui/components/resizable";
import { useMemo, useState } from "react";
import { ChatTopControlBar } from "./chat-top-control-bar";
import { CodeView } from "./code-view";
import { MailTemplatePreviewer } from "./mail-template-previewer";

export const RightPanel = () => {
  const [view, setView] = useState<"code" | "preview">("preview");
  // store
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);
  const chatVersionsMap = useChatStore((s) => s.chatVersions);

  const chatVersions = useMemo(() => {
    return Array.from(chatVersionsMap.values());
  }, [chatVersionsMap]);
  const selectedVersion = useMemo(() => {
    if (selectedVersionId) {
      const selected = chatVersionsMap.get(selectedVersionId);
      if (selected) return selected;
      return null;
    }
  }, [chatVersionsMap, selectedVersionId]);

  if (!selectedVersion) {
    return <h1>please selet the version</h1>;
  }
  return (
    <ResizablePanel defaultSize={"75%"} className="grid">
      <div className="flex h-full flex-col justify-center">
        <ChatTopControlBar
          chatVersions={chatVersions}
          view={view}
          setView={setView}
        />
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
