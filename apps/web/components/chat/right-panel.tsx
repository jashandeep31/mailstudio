import { useChatStore } from "@/zustand-store/chat-store";
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
  const activeStream = useChatStore((s) => s.activeStream);

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

  const isStreamingCurrentVersion =
    !!selectedVersion &&
    activeStream?.versionId === selectedVersion.chat_versions.id &&
    !selectedVersion.chat_version_outputs?.html_code;

  return (
    <div className="grid h-full min-h-0">
      {selectedVersion ? (
        <div className="flex h-full min-h-0 flex-col">
          <ChatTopControlBar
            chatVersions={chatVersions}
            view={view}
            setView={setView}
            iframeWidth={iframeWidth}
            setIframeWidth={setIframeWidth}
          />
          <div className="grid min-h-0 flex-1 overflow-hidden">
            {view === "preview" ? (
              <MailTemplatePreviewer
                html={selectedVersion.chat_version_outputs?.html_code}
                width={iframeWidth}
                setWidth={setIframeWidth}
                isStreaming={isStreamingCurrentVersion}
                streamingMessage={activeStream?.response}
              />
            ) : view === "code" ? (
              <CodeView
                html={selectedVersion.chat_version_outputs?.html_code}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="animate-pulse rounded-md border border-dashed px-6 py-4 text-center">
            <p className="text-lg font-semibold">Preparing chat space</p>
            <p className="text-muted-foreground text-sm">
              We&apos;re syncing the latest conversation. This panel will update
              automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
