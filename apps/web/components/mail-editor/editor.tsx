"use client";
import { useChatStore } from "@/zustand-store/chat-store";
import { useMemo } from "react";
import grapesJSMJML from "grapesjs-mjml";
import grapesjs, { Editor } from "grapesjs";
import GjsEditor from "@grapesjs/react";
import "grapesjs/dist/css/grapes.min.css";

const EditorComponent = ({ mjmlCode }: { mjmlCode: string }) => {
  const onEditor = (editor: Editor) => {
    console.log("Editor loaded", { editor });
    editor.setComponents(mjmlCode);

    // Remove Import and Export buttons
    editor.Panels.removeButton("options", "export-template");
    editor.Panels.removeButton("options", "mjml-import");
  };

  return (
    <div className="grid min-h-0">
      <GjsEditor
        grapesjs={grapesjs}
        onEditor={onEditor}
        options={{
          // TODO: fix height remove the navbar height
          height: "calc(100vh - 56px)",

          storageManager: false,
        }}
        plugins={[grapesJSMJML]}
      />
    </div>
  );
};

// getting current chat version so that we can render it
const EditorWrapper = () => {
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
    // TODO: fix remove the mjml preview and mjml title these are causing issues in the render of the mjml
    <EditorComponent
      mjmlCode={selectedVersion.chat_version_outputs.mjml_code}
    />
  );
};

export default EditorWrapper;
