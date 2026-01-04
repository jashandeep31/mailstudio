import { Button } from "@repo/ui/components/button";
interface ChatTopControlBar {
  view: "preview" | "code";
  setView: React.Dispatch<React.SetStateAction<"code" | "preview">>;
}
export const ChatTopControlBar = ({ view, setView }: ChatTopControlBar) => {
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
    </div>
  );
};
