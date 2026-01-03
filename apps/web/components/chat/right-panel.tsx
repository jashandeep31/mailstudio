import { Button } from "@repo/ui/components/button";
import { useChatStore } from "@/zustand-store/chat-store";
import { ResizablePanel } from "@repo/ui/components/resizable";
import { Monitor, Smartphone, TabletSmartphone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

export const RightPanel = (props: {}) => {
  const selectedVersion = useChatStore((s) => s.selectedVersion);
  const activeStream = useChatStore((s) => s.activeStream);
  if (!selectedVersion) {
    return <h1>please selet the version</h1>;
  }
  const handleCopyHtml = () => {
    navigator.clipboard.writeText(
      selectedVersion.chat_version_outputs?.html_code || "",
    );
  };
  return (
    <ResizablePanel>
      <div className="flex h-full w-full flex-col justify-center">
        <div className="flex w-full items-center justify-between border-b p-1">
          <div className="bg-muted rounded-md p-1">
            <Button variant={"default"} size={"sm"}>
              Preview
            </Button>
            <Button variant={"ghost"} size={"sm"}>
              Code
            </Button>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select screen size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="apple">
                    <Smartphone /> Mobile
                  </SelectItem>
                  <SelectItem value="banana">
                    <TabletSmartphone /> Tablet
                  </SelectItem>
                  <SelectItem value="blueberry">
                    <Monitor /> Desktop
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedVersion.chat_version_outputs?.html_code && (
          <MailTemplatePreviewer
            html={selectedVersion.chat_version_outputs.html_code}
          />
        )}
      </div>
    </ResizablePanel>
  );
};

const MailTemplatePreviewer = ({ html }: { html: string }) => {
  return (
    <div className="bg-muted flex flex-1 justify-center p-4">
      <iframe srcDoc={html} className="h-full w-[300px] border"></iframe>
    </div>
  );
};
