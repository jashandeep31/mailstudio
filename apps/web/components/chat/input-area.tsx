import { Button } from "@repo/ui/components/button";
import { ArrowUp, Command, CornerDownLeft, Plus } from "lucide-react";
import React from "react";

interface InputArea {
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
}

export default function InputArea({
  userPrompt,
  setUserPrompt,
  handleSubmit,
}: InputArea) {
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const baseHeight = 100;
  const maxHeight = baseHeight * 1.5;

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = `${baseHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    const nextHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [userPrompt, baseHeight, maxHeight]);

  return (
    <div
      className={`bg-background rounded-md border p-3 shadow transition-colors ${
        isFocused ? "border-secondary" : "border-border"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={userPrompt}
        onChange={(e) => {
          setUserPrompt(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        style={{
          minHeight: `${baseHeight}px`,
          maxHeight: `${maxHeight}px`,
          overflowY: "hidden",
        }}
        className="w-full resize-none border-0 outline-0 focus:border-0"
        placeholder="Create the mail template"
      ></textarea>
      <div className="flex items-center justify-between">
        <Button variant={"ghost"}>
          <Plus />{" "}
        </Button>
        <div className="flex items-end gap-2">
          <div className="flex flex-col text-right">
            <div className="text-foreground mt-1 inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium">
              <Command className="h-3 w-3" />
              <span>+</span>
              <CornerDownLeft className="h-3 w-3" />
            </div>
          </div>
          <Button
            disabled={!userPrompt}
            onClick={handleSubmit}
            className="gap-1"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
