import { useChatStore } from "@/zustand-store/chat-store";
import { ResizablePanel } from "@repo/ui/components/resizable";
import { useMemo, useState } from "react";
import { ChatTopControlBar } from "./chat-top-control-bar";
import { CodeView } from "./code-view";
import { MailTemplatePreviewer } from "./mail-template-previewer";

interface RightPanel {
  view: "code" | "preview" | "edit";
  setView: React.Dispatch<React.SetStateAction<"code" | "preview" | "edit">>;
}
export const RightPanel = ({ view, setView }: RightPanel) => {
  const [iframeWidth, setIframeWidth] = useState<number>(350);

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
          iframeWidth={iframeWidth}
          setIframeWidth={setIframeWidth}
        />
        <div className="grid flex-1">
          {view === "preview" ? (
            <MailTemplatePreviewer
              html={selectedVersion.chat_version_outputs?.html_code}
              width={iframeWidth}
              setWidth={setIframeWidth}
            />
          ) : view === "code" ? (
            <CodeView html={selectedVersion.chat_version_outputs?.html_code} />
          ) : null}
        </div>
      </div>
    </ResizablePanel>
  );
};
