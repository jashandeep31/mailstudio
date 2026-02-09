"use client";

import { useChatStore } from "@/zustand-store/chat-store";
import { useEffect, useMemo, useRef, useState } from "react";
import { getClassesInjectedMJML } from "./lib/helpers";
import { handleIframeClick } from "./lib/iframe-click-handler";
import { applyTagEdits } from "./lib/tag-editor";
import mjml2html from "mjml-browser";
import LeftSideBar from "./left-sidebar";
import RightSidebar from "./right-sidebar";

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

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoaded = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.addEventListener("click", (e) => {
        handleIframeClick({
          e,
          processedMJML,
          setCurrentEditingFullTag,
          setEditableTags,
        });
      });
    };

    iframe.addEventListener("load", handleLoaded);

    return () => {
      iframe.removeEventListener("load", handleLoaded);
    };
  }, [activeHTML, activeMJML, processedMJML]);

  // Handling the values changes
  useEffect(() => {
    if (!currentEditingFullTag) return;
    // checking if some values are changed by the user
    const hasChanges = editableTags.some((t) => t.value !== t.preValue);
    if (!hasChanges) return;

    // debounce if user is still updating the values
    const timer = setTimeout(() => {
      const { newMJML, updatedTag } = applyTagEdits({
        currentEditingFullTag,
        editableTags,
        activeMJML,
      });
      setEditedMJML(newMJML);
      setCurrentEditingFullTag(updatedTag);
      setEditableTags((prev) => prev.map((t) => ({ ...t, preValue: t.value })));
    }, 1000);

    return () => clearTimeout(timer);
  }, [editableTags, currentEditingFullTag, activeMJML]);

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
