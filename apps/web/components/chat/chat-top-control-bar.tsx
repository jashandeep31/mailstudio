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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

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
      <div className="flex items-center gap-2">
        <Select
          onValueChange={(e) => {
            setSelectedVersionId(e);
          }}
          defaultValue={selectedVersionId!}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select a Version" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
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
        <SendMailDropDown />
      </div>
    </div>
  );
};
const SendMailDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>Send Mail</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 min-w-96">
        {/* <DropdownMenuLabel>Send Template</DropdownMenuLabel> */}
        <div className="p-3">
          <Label className="mb-2">Select email</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="your@email.com" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>select email</SelectLabel>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="mt-3 flex justify-end">
            <Button>Send Mail</Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
