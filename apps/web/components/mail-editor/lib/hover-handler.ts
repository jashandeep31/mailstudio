import { RefObject } from "react";

interface HandleIHover {
  e: MouseEvent;
  hoveredElRef: RefObject<HTMLElement | null>;
}
export const injectHoverStyles = (doc: Document) => {
  const style = doc.createElement("style");
  style.innerHTML = `
    .editor-hovered {
      box-shadow: inset 0 0 0 2px  #000000;
      cursor: pointer;
      position: relative;
    }
  `;
  doc.head.appendChild(style);
};

export function handleIframeElementHover({ e, hoveredElRef }: HandleIHover) {
  let el = e.target as HTMLElement | null;
  if (!el) return;

  e.preventDefault();

  while (el) {
    const customClass = Array.from(el.classList).find((cls) =>
      cls.startsWith("custom-el-"),
    );

    if (customClass) {
      if (hoveredElRef.current !== el) {
        hoveredElRef.current?.classList.remove("editor-hovered");
        el.classList.add("editor-hovered");
        hoveredElRef.current = el;
      }
      return;
    }

    el = el.parentElement as HTMLElement | null;
  }

  hoveredElRef.current?.classList.remove("editor-hovered");
  hoveredElRef.current = null;
}
