import { Button } from "@repo/ui/components/button";
import { ArrowUp, Command, CornerDownLeft, X } from "lucide-react";
import React from "react";
import AddButtonDropdown from "./add-button-dropdown";
import { useUploadMedia } from "@/hooks/use-media-upload";

interface InputAreaProps {
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (data: { mediaIds: string[]; brandKit?: string }) => void;
}

interface UploadingFile {
  file: File;
  percentage: number;
}

interface UploadedFile {
  id: string;
  name: string;
}

export default function InputArea({
  userPrompt,
  setUserPrompt,
  onSubmit,
}: InputAreaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedBrand, setSelectedBrand] = React.useState<
    string | undefined
  >();
  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);
  const [uploadingFile, setUploadingFile] =
    React.useState<UploadingFile | null>(null);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { uploadState, uploadMedia } = useUploadMedia();
  const baseHeight = 100;
  const maxHeight = baseHeight * 1.5;

  const isPromptValid = React.useMemo(() => {
    const trimmed = userPrompt.trim();
    if (!trimmed) return false;
    return trimmed.split(/\s+/).filter(Boolean).length >= 5;
  }, [userPrompt]);

  // Handle textarea auto-resize
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = `${baseHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    const nextHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [userPrompt, baseHeight, maxHeight]);

  // Start uploading next file from queue
  const startNextUpload = React.useCallback(() => {
    if (uploadQueue.length > 0 && !uploadingFile) {
      const nextFile = uploadQueue[0];
      if (nextFile) {
        setUploadingFile({ file: nextFile, percentage: 0 });
        setUploadQueue((prev) => prev.slice(1));
        uploadMedia(nextFile);
      }
    }
  }, [uploadQueue, uploadingFile, uploadMedia]);

  // Monitor upload state changes
  React.useEffect(() => {
    if (uploadState.state === "uploading" && uploadingFile) {
      setUploadingFile((prev) =>
        prev ? { ...prev, percentage: uploadState.percentage } : null,
      );
    } else if (uploadState.state === "uploaded" && uploadingFile) {
      setUploadedFiles((prev) => [
        ...prev,
        { id: uploadState.id, name: uploadingFile.file.name },
      ]);
      setUploadingFile(null);
    }
  }, [uploadState, uploadingFile]);

  // Start next upload when current finishes
  React.useEffect(() => {
    if (!uploadingFile && uploadQueue.length > 0) {
      startNextUpload();
    }
  }, [uploadingFile, uploadQueue, startNextUpload]);

  const submitHandler = () => {
    if (isPromptValid) {
      const mediaIds = uploadedFiles.map((file) => file.id);
      onSubmit({ mediaIds, brandKit: selectedBrand });
      setUserPrompt("");
      setUploadedFiles([]);
      setSelectedBrand(undefined);
    }
  };

  const handleAddPhotos = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadQueue((prev) => [...prev, ...newFiles]);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFromQueue = (index: number) => {
    setUploadQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddBrandKit = (brand?: string) => {
    if (brand) {
      setSelectedBrand(brand);
    }
  };

  const handleRemoveBrand = () => {
    setSelectedBrand(undefined);
  };

  const hasAttachments =
    uploadQueue.length > 0 || uploadingFile || uploadedFiles.length > 0;

  return (
    <>
      <div
        className={`bg-background rounded-md border p-3 shadow transition-colors ${
          isFocused ? "border-secondary" : "border-border"
        }`}
      >
        {hasAttachments && (
          <div className="mb-2 flex flex-wrap gap-1">
            {/* Uploaded files - green */}
            {uploadedFiles.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs text-green-800"
              >
                <span className="max-w-24 truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-green-800 hover:bg-transparent"
                  onClick={() => handleRemoveUploadedFile(index)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </div>
            ))}

            {/* Currently uploading file - animated */}
            {uploadingFile && (
              <div className="relative flex animate-pulse items-center gap-1 overflow-hidden rounded bg-blue-50 px-2 py-1 text-xs">
                <span className="max-w-24 truncate">
                  {uploadingFile.file.name}
                </span>
                <span className="font-medium text-blue-600">
                  {uploadingFile.percentage}%
                </span>
              </div>
            )}

            {/* Queued files - gray */}
            {uploadQueue.map((file, index) => (
              <div
                key={`queue-${index}`}
                className="bg-muted text-muted-foreground flex items-center gap-1 rounded px-2 py-1 text-xs"
              >
                <span className="max-w-24 truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-auto p-0 hover:bg-transparent"
                  onClick={() => handleRemoveFromQueue(index)}
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
