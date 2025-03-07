import ChatMessage from "@/components/chat-message"
import FeedbackBar from "@/components/feedback-bar"
import ScrollToBottom from "@/components/scroll-to-bottom"
import { useMessages } from "@/lib/api"


export default function Messages() {
  const { data: messages = [] } = useMessages()

  if (messages.length === 0)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-medium mb-2">Welcome to AI Assistant</h2>
          <p>Ask me anything to get started!</p>
        </div>
      </div>
    )
  const lastMessage = messages[messages.length - 1]
  return (
    <div className="h-screen flex flex-col gap-3">
      <div className="flex flex-1 flex-col gap-3 p-4">
        <ScrollToBottom>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div className="flex items-center justify-end min-w-full">
            <FeedbackBar messageId={lastMessage.id} />
          </div>
        </ScrollToBottom>
      </div>

    </div >
  )

}