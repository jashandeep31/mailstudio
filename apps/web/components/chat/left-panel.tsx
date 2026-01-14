import { ResizablePanel } from "@repo/ui/components/resizable";
import React, { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Copy, Check } from "lucide-react";
import { ChatVersionAggregate, StreamingOverview } from "@/app/chat/[id]/types";
import InputArea from "./input-area";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import { useParams } from "next/navigation";
import MarkdownRenderer from "./markdown-renderer";

interface LeftPanel {
  versions: ChatVersionAggregate[];
  streamingOverview: StreamingOverview | null;
}

export default function LeftPanel({ versions, streamingOverview }: LeftPanel) {
  const params = useParams();
  const { sendEvent } = useWebSocketContext();
  const [userPrompt, setUserPrompt] = useState(
    "The template is missing proper formatting please do in and make it looking little better",
  );

  const handleSubmit = (data: { mediaIds: string[]; brandKit?: string }) => {
    sendEvent("event:refine-template-message", {
      chatId: params.id as string,
      message: userPrompt,
      media: data.mediaIds,
      brandKitId: data.brandKit,
      prevVersionId: versions.at(-1)?.chat_versions.id || "",
    });
  };

  return (
    <ResizablePanel
      defaultSize={"25%"}
      className="flex h-full min-h-0 w-full flex-col p-3"
    >
      {/* 🔹 SCROLLABLE MESSAGES */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {versions.length ? (
          versions.map((version) => (
            <div
              key={version.chat_versions.id}
              className="mb-8 border-b border-dashed pb-4"
            >
              {version.chat_version_prompts && (
                <UserChatBubble message={version.chat_version_prompts.prompt} />
              )}

              {streamingOverview?.versionId === version.chat_versions.id &&
                !version.chat_version_outputs && (
                  <div className="mt-3">
                    <p className="text-muted-foreground text-sm font-bold">
                      Working..
                    </p>
                    <div className="mt-1">
                      <MarkdownRenderer
                        content={streamingOverview.response || ""}
                      />
                    </div>
                  </div>
                )}

              {version.chat_version_outputs && (
                <div className="mt-2">
                  <MarkdownRenderer
                    content={version.chat_version_outputs.overview || ""}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-end gap-2">
                <div className="bg-muted/60 h-16 w-3/4 animate-pulse rounded-md" />
                <div className="flex justify-end gap-2">
                  <div className="bg-muted/50 h-8 w-8 animate-pulse rounded-md" />
                  <div className="bg-muted/50 h-8 w-8 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
            <p className="text-muted-foreground text-sm">
              Waiting for the latest conversation to load…
            </p>
          </div>
        )}
      </div>

      {/* 🔹 FIXED INPUT */}
      <div className="shrink-0 pt-3">
        <InputArea
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          onSubmit={handleSubmit}
        />
      </div>
    </ResizablePanel>
  );
}
interface UserChatBubble {
  message: string;
}
const UserChatBubble = ({ message }: UserChatBubble) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="hidden-scrollbar bg-muted max-w-[85%] overflow-auto rounded-xl rounded-tr-sm border px-4 py-2 text-sm">
        {message}
      </div>
      <div className="flex justify-end gap-1 px-1">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="h-6 w-6"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="text-muted-foreground h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
};
