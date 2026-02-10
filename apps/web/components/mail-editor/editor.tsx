"use cient";
import { useChatStore } from "@/zustand-store/chat-store";
import { useMemo } from "react";
import grapesJSMJML from "grapesjs-mjml";
import grapesjs, { Editor } from "grapesjs";
import GjsEditor, { Canvas } from "@grapesjs/react";
import "grapesjs/dist/css/grapes.min.css";
import RightSidebar from "./components/right-sidebar";

const EditorComponent = ({ mjmlCode }: { mjmlCode: string }) => {
  const onEditor = (editor: Editor) => {
    console.log("Editor loaded", { editor });
    editor.setComponents(mjmlCode);
  };

  return (
    <div className="grid min-h-0">
      <GjsEditor
        grapesjs={grapesjs}
        grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
        onEditor={onEditor}
        options={{
          // TODO: fix height remove the navbar height
          height: "90vh",
          storageManager: false,
        }}
        plugins={[grapesJSMJML]}
      >
        <div className="flex">
          <div className="h-full w-[20%] p-2">
            <div>sidebar 1 </div>
          </div>
          <div className="grid h-full flex-1">
            <Canvas />
          </div>
          <div className="h-full w-[20%] p-2">
            <RightSidebar />
          </div>
        </div>
      </GjsEditor>
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
