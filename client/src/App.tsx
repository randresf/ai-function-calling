
import { LoaderIcon, Send } from "lucide-react"
import LoadingIndicator from "@/components/loading-indicator"
import { useAssistant } from "@/lib/useAssistant"
import Messages from "@/components/messages"
import ChatStatus from "@/components/chat-status"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const { input, handleInputChange, handleSubmit, status } = useAssistant()
  const isLoading = status === "thinking" || status === "generating"
  return (
    <div className="flex flex-col h-[calc(90vh-64px)] justify-center items-center ">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <Messages />
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">AI</div>
            <div className="flex-1">
              <LoadingIndicator />
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-2 sm:p-4 bg-white min-w-screen" >
        <div className="min-h-2.5">
          <ChatStatus />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="p-2 sm:p-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <LoaderIcon size={18} /> : <Send size={18} />}
          </Button>
        </form>
      </div>
    </div>
  )
}

