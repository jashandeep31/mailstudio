import { ChatVersionAggregate } from "@/app/chat/[id]/types";
import { useChatStore } from "@/zustand-store/chat-store";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
interface ChatTopControlBar {
  view: "preview" | "code";
  setView: React.Dispatch<React.SetStateAction<"code" | "preview">>;
  chatVersions: ChatVersionAggregate[];
}
export const ChatTopControlBar = ({
  chatVersions,
  view,
  setView,
}: ChatTopControlBar) => {
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);
  const setSelectedVersionId = useChatStore((s) => s.setSelectedVersionId);

  return (
    <div className="flex w-full items-center justify-between border-b p-1">
      <div className="bg-muted rounded-md p-1">
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
      </div>
      <Select
        onValueChange={(e) => {
          setSelectedVersionId(e);
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select a Version" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Versions</SelectLabel>
            {chatVersions.map((version) => (
              <SelectItem
                key={version.chat_versions.id}
                value={version.chat_versions.id}
              >
                V{version.chat_versions.version_number}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
