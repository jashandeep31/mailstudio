"use client";

import { useChatStore } from "@/zustand-store/chat-store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getClassesInjectedMJML } from "./lib/helpers";
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
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const activeMJML = editedMJML ?? processedMJML;
  const activeHTML = useMemo(() => {
    return mjml2html(activeMJML).html;
  }, [activeMJML]);
  const activeMJMLRef = useRef(activeMJML);
  const initialIframeHTMLRef = useRef(activeHTML);
  const lastRenderedHTMLRef = useRef(activeHTML);

  useEffect(() => {
    activeMJMLRef.current = activeMJML;
  }, [activeMJML]);

  useEffect(() => {
    // Reset editor state when a different MJML template is selected.
    setEditedMJML(null);
    setCurrentEditingFullTag(null);
    setEditableTags([]);
  }, [processedMJML]);

  const handleIframeClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let el = e.target as HTMLElement | null;
    while (el) {
      const customClass = Array.from(el.classList).find((cls) =>
        cls.startsWith("custom-el-"),
      );

      if (customClass) {
        const regex = new RegExp(
          `<(mj-[a-z-]+)([^>]*?)css-class="${customClass}"([^>]*)>`,
          "i",
        );

        const match = activeMJMLRef.current.match(regex);
        if (!match) {
          return;
        }
        const fullTag = match[0];
        setCurrentEditingFullTag(fullTag);

        // getting and putting the attributes
        // TODO: this only add the presents write the rules to append more
        const attrRegex = /([a-z-]+)="([^"]*)"/gi;
        const tags: EditableTag[] = [];

        let attrMatch;
        while ((attrMatch = attrRegex.exec(fullTag)) !== null) {
          const attrName = attrMatch[1]!;
          if (attrName === "css-class") continue;
          tags.push({
            name: attrName,
            value: attrMatch[2]!,
            preValue: attrMatch[2]!,
          });
        }
        const innertext = el.innerText;

        // TODO: testing mj-text only not for production
        if (fullTag.includes("<mj-text")) {
          setEditableTags([
            ...tags,
            { name: "innertext", value: innertext, preValue: innertext },
          ]);
        } else {
          setEditableTags([...tags]);
        }
        return;
      }
      el = el.parentElement;
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let detachClick: (() => void) | null = null;

    const attachClickListener = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.addEventListener("click", handleIframeClick);
      detachClick = () => doc.removeEventListener("click", handleIframeClick);
    };

    const handleLoad = () => {
      setIsIframeLoaded(true);
      detachClick?.();
      attachClickListener();
    };

    const readyState = iframe.contentDocument?.readyState;
    if (readyState === "interactive" || readyState === "complete") {
      setIsIframeLoaded(true);
      attachClickListener();
    }

    iframe.addEventListener("load", handleLoad);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      detachClick?.();
    };
  }, [handleIframeClick]);

  useEffect(() => {
    if (!isIframeLoaded || lastRenderedHTMLRef.current === activeHTML) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const parser = new DOMParser();
    const nextDoc = parser.parseFromString(activeHTML, "text/html");

    const scrollingElement = doc.scrollingElement ?? doc.documentElement;
    const scrollTop = scrollingElement?.scrollTop ?? 0;
    const scrollLeft = scrollingElement?.scrollLeft ?? 0;

    doc.head.innerHTML = nextDoc.head.innerHTML;
    doc.body.innerHTML = nextDoc.body.innerHTML;
    lastRenderedHTMLRef.current = activeHTML;

    requestAnimationFrame(() => {
      const nextScrollingElement = doc.scrollingElement ?? doc.documentElement;
      if (!nextScrollingElement) return;
      nextScrollingElement.scrollTop = scrollTop;
      nextScrollingElement.scrollLeft = scrollLeft;
    });
  }, [activeHTML, isIframeLoaded]);

  // Handling the values changes
  useEffect(() => {
    if (!currentEditingFullTag) return;
    // checking if some values are changed by the user
    const hasChanges = editableTags.some((t) => t.value !== t.preValue);
    if (!hasChanges) return;

    // debounce if user is still updating the values
    const timer = setTimeout(() => {
      let updatedTag = currentEditingFullTag;
      for (const tag of editableTags) {
        if (tag.value !== tag.preValue) {
          updatedTag = updatedTag.replace(
            `${tag.name}="${tag.preValue}"`,
            `${tag.name}="${tag.value}"`,
          );
        }
      }
      const newMJML = activeMJML.replace(currentEditingFullTag, updatedTag);
      setEditedMJML(newMJML);
      setCurrentEditingFullTag(updatedTag);
      setEditableTags((prev) => prev.map((t) => ({ ...t, preValue: t.value })));
    }, 30);

    return () => clearTimeout(timer);
  }, [editableTags, currentEditingFullTag, activeMJML]);

  return (
    <div className="flex h-full">
      <RightSidebar />
      <div className="bg-muted flex h-full flex-1 justify-center py-3">
        <iframe
          ref={iframeRef}
          srcDoc={initialIframeHTMLRef.current}
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
