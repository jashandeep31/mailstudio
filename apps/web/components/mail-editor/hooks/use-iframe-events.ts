import { RefObject, useEffect } from "react";
import { EditableTag } from "@/components/mail-editor/editor";
import { handleIframeClick } from "@/components/mail-editor/lib/iframe-click-handler";
import {
  handleIframeElementHover,
  injectHoverStyles,
} from "@/components/mail-editor/lib/hover-handler";

interface UseIframeEventsParams {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  hoveredElRef: RefObject<HTMLElement | null>;
  processedMJML: string;
  activeHTML: string;
  activeMJML: string;
  setCurrentEditingFullTag: (tag: string | null) => void;
  setEditableTags: (tags: EditableTag[]) => void;
}

export function useIframeEvents({
  iframeRef,
  hoveredElRef,
  processedMJML,
  activeHTML,
  activeMJML,
  setCurrentEditingFullTag,
  setEditableTags,
}: UseIframeEventsParams) {
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let doc: Document | null = null;

    const mouseMoveHandler = (e: MouseEvent) => {
      handleIframeElementHover({ e, hoveredElRef });
    };

    const clickHandler = (e: MouseEvent) => {
      handleIframeClick({
        e,
        processedMJML,
        setCurrentEditingFullTag,
        setEditableTags,
      });
    };

    const handleLoaded = () => {
      doc = iframe.contentDocument;
      if (!doc) return;

      doc.addEventListener("mousemove", mouseMoveHandler);
      doc.addEventListener("click", clickHandler);

      injectHoverStyles(doc);
    };

    iframe.addEventListener("load", handleLoaded);

    return () => {
      iframe.removeEventListener("load", handleLoaded);

      if (doc) {
        doc.removeEventListener("mousemove", mouseMoveHandler);
        doc.removeEventListener("click", clickHandler);
      }
    };
  }, [
    activeHTML,
    activeMJML,
    processedMJML,
    iframeRef,
    hoveredElRef,
    setCurrentEditingFullTag,
    setEditableTags,
  ]);
}
