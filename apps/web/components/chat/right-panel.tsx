import { useChatStore } from "@/zustand-store/chat-store"
import { ResizablePanel } from "@repo/ui/components/resizable"

export const RightPanel = (props: {}) => {
  const selectedVersion = useChatStore(s => s.selectedVersion)
  return (
    <ResizablePanel>

    </ResizablePanel>
  )
}
