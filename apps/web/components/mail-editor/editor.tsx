"use client";
import { useChatStore } from "@/zustand-store/chat-store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import mjml2html from "mjml-browser";

// Generate a random class name
function generateRandomClass(): string {
  return "el-" + Math.random().toString(36).substring(2, 10);
}

// Inject random CSS classes into each MJML element and HTML elements like span
function injectRandomClasses(mjmlCode: string): string {
  // Match MJML tags (mj-*) and inject css-class attribute with random class
  let result = mjmlCode.replace(
    /<(mj-[a-z-]+)(\s|>)/gi,
    (match, tagName, after) => {
      const randomClass = generateRandomClass();
      if (after === ">") {
        return `<${tagName} css-class="custom-${randomClass}">`;
      }
      return `<${tagName} css-class="custom-${randomClass}" `;
    },
  );

  // Match HTML elements (span, div, p, a, etc.) and inject/append class attribute
  result = result.replace(
    /<(span|div|p|a|img|strong|em|b|i|u)(\s[^>]*)?>/gi,
    (match, tagName, attrs) => {
      const randomClass = `custom-${generateRandomClass()}`;
      if (!attrs) {
        return `<${tagName} class="${randomClass}">`;
      }
      // Check if class attribute already exists
      if (/class\s*=\s*["']/.test(attrs)) {
        // Append to existing class
        return `<${tagName}${attrs.replace(/class\s*=\s*["']([^"']*)["']/, `class="$1 ${randomClass}"`)}>`;
      }
      return `<${tagName} class="${randomClass}"${attrs}>`;
    },
  );

  return result;
}

const MainEditor = ({ html }: { html: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentSelectedElement, setCurrentSelectedElement] =
    useState<null | HTMLElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`${html}`);
    doc.close();
    let selectedEl: HTMLElement | null = null;
    let outlinedEl: HTMLElement | null = null;
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (!target) return;
      selectedEl?.classList.remove("selected");
      selectedEl = target;
      target.classList.add("selected");
      setCurrentSelectedElement(target);
      setInputValue(target.innerHTML); // Update input value when element is selected

      // Remove outline from previously outlined element
      if (outlinedEl) {
        outlinedEl.style.outline = "";
        outlinedEl.style.outlineOffset = "";
      }

      // Find the element with custom- class (traverse up to parent if needed)
      let el: HTMLElement | null = target;
      while (el) {
        const customClass = Array.from(el.classList).find((cls) =>
          cls.startsWith("custom-"),
        );
        if (customClass) {
          const isFromParent = el !== target;
          console.log(
            `${isFromParent ? "[from parent] " : ""}Custom class: ${customClass}`,
          );
          // Add outline to the element with custom- class
          el.style.outline = "2px solid #3b82f6";
          el.style.outlineOffset = "2px";
          outlinedEl = el;
          break;
        }
        el = el.parentElement;
      }
    };

    doc.addEventListener("click", onClick);
    return () => doc.removeEventListener("click", onClick);
  }, [html]);
  return (
    <div className="flex h-full">
      <div className="h-full w-[300px] border-r">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (currentSelectedElement) {
              currentSelectedElement.innerHTML = e.target.value;
            }
          }}
        />
      </div>
      <div className="flex flex-1 justify-center">
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100%", border: "1px solid #ddd" }}
        />
      </div>
    </div>
  );
};

export default function Editor() {
  const [htmlCode, setHtmlCode] = useState<string>("");
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);
  const chatVersionsMap = useChatStore((s) => s.chatVersions);
  const selectedVersion = useMemo(() => {
    if (selectedVersionId) return chatVersionsMap.get(selectedVersionId);
  }, [chatVersionsMap, selectedVersionId]);
  useEffect(() => {
    if (selectedVersion?.chat_version_outputs?.mjml_code) {
      const mjmlCode = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image width="100px" src="https://yourwebsite.com/assets/img/logo-small.png" alt="Logo" />
        
        <mj-divider border-color="#F45E43" />
        
        <mj-text font-size="20px" color="#F45E43" font-family="Helvetica, Arial, sans-serif">
          Hello World
          <span style="font-size: 18px; letter-spacing: 2px; color: #2ECC71;">TODAY5</span>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

      // Inject random classes into each MJML element
      const mjmlWithClasses = injectRandomClasses(mjmlCode);
      console.log("MJML with injected classes:", mjmlWithClasses);

      const mjmlRes = mjml2html(mjmlWithClasses, {
        keepComments: false,
      });
      setHtmlCode(mjmlRes.html);
    }
  }, [selectedVersion]);

  if (!selectedVersion) return <h1>Not chat is selected </h1>;
  return <MainEditor html={htmlCode} />;
}
