import { Button } from "@repo/ui/components/button";
import { ArrowUp, Command, CornerDownLeft, X } from "lucide-react";
import React from "react";
import AddButtonDropdown from "./add-button-dropdown";

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
  const [selectedBrand, setSelectedBrand] = React.useState<
    string | undefined
  >();
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const baseHeight = 100;
  const maxHeight = baseHeight * 1.5;
  const isPromptValid = React.useMemo(() => {
    const trimmed = userPrompt.trim();
    if (!trimmed) return false;
    return trimmed.split(/\s+/).filter(Boolean).length >= 5;
  }, [userPrompt]);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = `${baseHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    const nextHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [userPrompt, baseHeight, maxHeight]);

  const submitHandler = () => {
    if (isPromptValid) {
      handleSubmit();
      setUserPrompt("");
    }
  };

  const handleAddPhotos = () => {
    // Trigger file input click to open file manager
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      // TODO: Process selected files for upload to server
      console.log("Selected files:", newFiles);
      // You can add file upload logic here
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddBrandKit = (brand?: string) => {
    if (brand) {
      setSelectedBrand(brand);
      // TODO: Send brand selection to server
      console.log("Brand selected for server:", brand);
    }
  };

  const handleRemoveBrand = () => {
    setSelectedBrand(undefined);
    // TODO: Notify server about brand removal
    console.log("Brand selection removed");
  };

  return (
    <>
      <div
        className={`bg-background rounded-md border p-3 shadow transition-colors ${
          isFocused ? "border-secondary" : "border-border"
        }`}
      >
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-muted text-muted-foreground flex items-center gap-1 rounded px-2 py-1 text-xs"
              >
                <span className="max-w-24 truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-auto p-0 hover:bg-transparent"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={userPrompt}
          onChange={(e) => {
            setUserPrompt(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.ctrlKey || e.metaKey) &&
              isPromptValid
            ) {
              e.preventDefault();
              submitHandler();
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
          <AddButtonDropdown
            selectedBrand={selectedBrand}
            onAddPhotos={handleAddPhotos}
            onAddBrandKit={handleAddBrandKit}
            onRemoveBrand={handleRemoveBrand}
          />
          <div className="flex items-end gap-2">
            <div className="flex flex-col text-right">
              <div className="text-muted-foreground mt-1 inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium">
                <Command className="h-3 w-3" />
                <span>+</span>
                <CornerDownLeft className="h-3 w-3" />
              </div>
            </div>
            <Button
              disabled={!isPromptValid}
              onClick={submitHandler}
              className="gap-1"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        hidden
        multiple
        accept="image/*"
      />
    </>
  );
}
