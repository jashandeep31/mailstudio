"use client";

import { useChatStore } from "@/zustand-store/chat-store";
import { useEffect, useMemo, useRef, useState } from "react";
import { getClassesInjectedMJML } from "./lib/helpers";
import mjml2html from "mjml-browser";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";

interface EditableTag {
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
        e.preventDefault();
        e.stopPropagation();
        let el = e.target as HTMLElement | null;
        while (el) {
          if (
            el.getAttribute("src") &&
            !Array.from(el.classList).some((cls) =>
              cls.startsWith("custom-el-"),
            )
          ) {
            setCurrentEditingFullTag(null);
            setEditableTags([
              {
                name: "src",
                value: el.getAttribute("src")!,
                preValue: el.getAttribute("src")!,
              },
            ]);
            return;
          }
          const hasCustomClass = Array.from(el.classList).some((cls) =>
            cls.startsWith("custom-el-"),
          );
          if (hasCustomClass) {
            const customClass = Array.from(el.classList).find((cls) =>
              cls.startsWith("custom-el-"),
            );
            if (!customClass) return;
            const regex = new RegExp(
              `<(mj-[a-z-]+)([^>]*?)css-class="${customClass}"([^>]*)>`,
              "i",
            );
            const match = processedMJML.match(regex);
            if (match) {
              const fullTag = match[0];
              setCurrentEditingFullTag(fullTag);
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
              setEditableTags(tags);
            }
            return;
          }
          el = el.parentElement;
        }
      });
    };

    iframe.addEventListener("load", handleLoaded);

    return () => {
      iframe.removeEventListener("load", handleLoaded);
    };
  }, [activeHTML, activeMJML, processedMJML]);

  const handleApplyChanges = () => {
    if (!currentEditingFullTag) return;
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
  };

  return (
    <div className="flex h-full">
      <div className="w-3/4">
        {editableTags.map((tag) => (
          <div key={tag.name}>
            <Label>{tag.name}</Label>
            <Input
              value={tag.value}
              onChange={(e) => {
                setEditableTags((prev) =>
                  prev.map((t) =>
                    t.name === tag.name ? { ...t, value: e.target.value } : t,
                  ),
                );
              }}
            />
          </div>
        ))}
        {editableTags.length > 0 && (
          <button
            className="mt-2 rounded bg-blue-500 px-3 py-1 text-white"
            onClick={handleApplyChanges}
          >
            Apply
          </button>
        )}
      </div>
      <div className="h-full">
        <iframe
          ref={iframeRef}
          key={activeHTML}
          srcDoc={activeHTML}
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
        // mjmlCode={selectedVersion.chat_version_outputs.mjml_code}
        mjmlCode={`<mjml>
  <mj-body>
    <mj-section>
      <mj-column>

        <mj-image width="100px" src="https://mjml.io/assets/img/logo-white-small.png"></mj-image>"></mj-image>

        <mj-divider border-color="#F45E43"></mj-divider>

        <mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World</mj-text>

      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`}
        htmlCode={selectedVersion.chat_version_outputs.html_code}
      />
    </div>
  );
}
