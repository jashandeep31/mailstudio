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
      <div className="flex justify-center w-full">
        <iframe srcDoc={selectedVersion.chat_version_outputs?.html_code}></iframe>
      </div>
    </ResizablePanel>
  )
}


