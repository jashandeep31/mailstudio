"use client";
import { useChatStore } from "@/zustand-store/chat-store";
import { useMemo, useState } from "react";
import grapesJSMJML from "grapesjs-mjml";
import grapesjs, { Editor } from "grapesjs";
import GjsEditor from "@grapesjs/react";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import "grapesjs/dist/css/grapes.min.css";

const EditorComponent = ({ mjmlCode }: { mjmlCode: string }) => {
  const onEditor = (editor: Editor) => {
    console.log("Editor loaded", { editor });
    editor.setComponents(mjmlCode);

    // Remove Import and Export buttons
    // editor.Panels.removeButton("options", "export-template");
    editor.Panels.removeButton("options", "mjml-import");

    editor.on("update", () => {
      const mjmlData = editor.runCommand("mjml-code");
      console.log("Updated HTML:", editor.getHtml());
      console.log("Updated MJML:", mjmlData?.mjml);
    });
  };

  return (
    <div className="grid min-h-0">
      <GjsEditor
        grapesjs={grapesjs}
        onEditor={onEditor}
        options={{
          // TODO: fix height remove the navbar height
          height: "calc(100vh - 90px)",

          storageManager: false,
        }}
        plugins={[grapesJSMJML]}
      />
    </div>
  );
};

// getting current chat version so that we can render it
const EditorWrapper = ({
  view,
  setView,
}: {
  view: "preview" | "code" | "edit";
  setView: (view: "preview" | "code" | "edit") => void;
}) => {
  const [open, setOpen] = useState(true);
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editor in Beta</DialogTitle>
            <DialogDescription>
              Currently the editor is in beta mode. You cannot save changes, but
              you can explore the MJML or HTML directly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>I understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex h-12 items-center justify-center px-2">
        <div className="bg-muted inline-flex rounded-md p-1">
          <Button
            variant={view === "preview" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setView("preview")}
          >
            Preview
          </Button>
          <Button
            variant={view === "code" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setView("code")}
          >
            Code
          </Button>
          <Button
            variant={view === "edit" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setView("edit")}
          >
            Edit (beta)
          </Button>
        </div>
      </div>
      <EditorComponent
        mjmlCode={selectedVersion.chat_version_outputs.mjml_code}
      />
    </div>
  );
};

export default EditorWrapper;
