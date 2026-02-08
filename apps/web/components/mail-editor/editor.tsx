"use client";

import { useChatStore } from "@/zustand-store/chat-store";
import { useEffect, useMemo, useRef, useState } from "react";
import { getClassesInjectedMJML } from "./lib/helpers";
import mjml2html from "mjml-browser";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";

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
  const processedHTML = useMemo(() => {
    return mjml2html(processedMJML).html;
  }, [mjmlCode, processedMJML]);
  const [editableTags, setEditableTags] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);

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
          if (el.getAttribute("src")) {
            setEditableTags([
              { name: "Image", value: el.getAttribute("src")! },
            ]);
          }
          console.log(el.innerHTML);
          const hasCustomClass = Array.from(el.classList).some((cls) =>
            cls.startsWith("custom-el-"),
          );
          if (hasCustomClass) {
            console.log(el);
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
  }, [processedHTML]);

  return (
    <div className="flex h-full">
      <div className="w-3/4">
        {editableTags.map((tag) => (
          <div key={tag.name}>
            <Label>{tag.name}</Label>
            <Input value={tag.value} />
          </div>
        ))}
        {processedMJML}
      </div>
      <div className="h-full">
        <iframe
          ref={iframeRef}
          key={processedHTML}
          srcDoc={processedHTML}
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
