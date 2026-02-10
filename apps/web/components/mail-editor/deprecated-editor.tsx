"use client";

import { useChatStore } from "@/zustand-store/chat-store";
import { useMemo, useRef, useState } from "react";
import { getClassesInjectedMJML } from "./lib/helpers";
import mjml2html from "mjml-browser";
import LeftSideBar from "./left-sidebar";
import RightSidebar from "./right-sidebar";
import { useIframeEvents } from "./hooks/use-iframe-events";
import { useDebouncedTagEdits } from "./hooks/use-debounced-tag-edits";

export interface EditableTag {
  name: string;
  value?: string;
  preValue: string;
}
const PreviewRender = ({
  mjmlCode,
}: {
  htmlCode: string;
  mjmlCode: string;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hoveredElRef = useRef<HTMLElement | null>(null);
  const [editableTags, setEditableTags] = useState<EditableTag[]>([]);
  const [currentEditingFullTag, setCurrentEditingFullTag] = useState<
    string | null
  >(null);
  const [processedMJML, setProcessedMJML] = useState<string>(
    getClassesInjectedMJML(mjmlCode),
  );

  const activeMJML = processedMJML;
  const activeHTML = useMemo(() => {
    return mjml2html(activeMJML).html;
  }, [activeMJML]);

  useIframeEvents({
    iframeRef,
    hoveredElRef,
    processedMJML,
    activeHTML,
    activeMJML,
    setCurrentEditingFullTag,
    setEditableTags,
  });

  useDebouncedTagEdits({
    currentEditingFullTag,
    editableTags,
    activeMJML,
    setEditedMJML: setProcessedMJML,
    setCurrentEditingFullTag,
    setEditableTags,
  });

  return (
    <div className="flex h-full">
      <RightSidebar />
      <div className="bg-muted flex h-full flex-1 justify-center py-3">
        <iframe
          ref={iframeRef}
          srcDoc={activeHTML}
          className="grid h-full w-100 rounded border bg-white shadow"
        ></iframe>
      </div>
      <LeftSideBar
        editableTags={editableTags}
        setEditableTags={setEditableTags}
      />
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
        // mjmlCode={selectedVersion.chat_version_outputs.mjml_code}
        mjmlCode={`<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="100px" src="/assets/img/logo-small.png"></mj-image>

        <mj-divider padding-bottom="100px" border-color="#F45E43"></mj-divider>
        <mj-divider padding-bottom="100px" border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
<mj-section padding="10px" >
        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>
</mj-section>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`}
        htmlCode={selectedVersion.chat_version_outputs.html_code}
      />
    </div>
  );
}
