"use client";

import { useChatStore } from "@/zustand-store/chat-store";
import { useEffect, useMemo, useRef } from "react";
import { getClassesInjectedMJML } from "./lib/injected-mjml";

const PreviewRender = ({
  htmlCode,
  mjmlCode,
}: {
  htmlCode: string;
  mjmlCode: string;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const traceableMJML = getClassesInjectedMJML(mjmlCode);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoaded = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = e.target as HTMLElement;
        console.log("el is clicked");
        console.log(el.outerHTML);
      });
    };
    iframe.addEventListener("load", handleLoaded);

    return () => {
      iframe.removeEventListener("load", handleLoaded);
    };
  }, []);

  return (
    <div className="flex h-full">
      <div className="w-3/4"></div>
      <div className="h-full">
        <iframe
          ref={iframeRef}
          srcDoc={htmlCode}
          className="grid h-full w-100"
        ></iframe>
      </div>
    </div>
  );
};

export default function Editor() {
  const chatVersionsMap = useChatStore((s) => s.chatVersions);
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);
  const selectedVersion = useMemo(() => {
    if (selectedVersionId) {
      const selected = chatVersionsMap.get(selectedVersionId);
      if (selected) return selected;
      return null;
    }
  }, [chatVersionsMap, selectedVersionId]);
  if (
    !selectedVersion ||
    !selectedVersion.chat_version_outputs?.html_code ||
    !selectedVersion.chat_version_outputs.mjml_code
  ) {
    return null;
  }
  return (
    <div className="col-span-4 h-full">
      <PreviewRender
        mjmlCode={selectedVersion.chat_version_outputs.mjml_code}
        htmlCode={selectedVersion.chat_version_outputs.html_code}
      />
    </div>
  );
}
