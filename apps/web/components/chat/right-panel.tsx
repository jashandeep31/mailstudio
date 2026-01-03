import { Button } from "@repo/ui/components/button"
import { useChatStore } from "@/zustand-store/chat-store"
import { ResizablePanel } from "@repo/ui/components/resizable"

export const RightPanel = (props: {}) => {
  const selectedVersion = useChatStore(s => s.selectedVersion)
  const activeStream = useChatStore(s => s.activeStream)
  if (!selectedVersion) {
    return (<h1>please selet the version</h1>)
  }

  return (
    <ResizablePanel>
      <div className="flex justify-center w-full bg-red-100 h-full relative">
        <div className="flex items-center absolute top-0 w-full p-2"><Button>Copy Html</Button></div>
        <iframe srcDoc={selectedVersion.chat_version_outputs?.html_code} className="w-[300px]"></iframe>
      </div>
    </ResizablePanel>
  )
}


