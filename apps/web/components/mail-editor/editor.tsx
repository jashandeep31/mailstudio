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
  value: string;
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
  const processedMJML = useMemo(() => {
    return getClassesInjectedMJML(mjmlCode);
  }, [mjmlCode]);
  const [editableTags, setEditableTags] = useState<EditableTag[]>([]);
  const [currentEditingFullTag, setCurrentEditingFullTag] = useState<
    string | null
  >(null);
  const [editedMJML, setEditedMJML] = useState<string | null>(null);

  const activeMJML = editedMJML ?? processedMJML;
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
    setEditedMJML,
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
          className="bg-background grid h-full w-100 rounded border shadow"
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
        mjmlCode={selectedVersion.chat_version_outputs.mjml_code}
        htmlCode={selectedVersion.chat_version_outputs.html_code}
      />
    </div>
  );
}
