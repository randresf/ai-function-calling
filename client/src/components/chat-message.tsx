import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    type?: string
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {

  const isAssistantMessage = message.role === "assistant"

  return (
    <div className={`flex items-start gap-3 group  ${
          !isAssistantMessage ? "flex-row-reverse" : ""
        }`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
          !isAssistantMessage ? "bg-blue-500" : "bg-primary"
        }`}
      >
        {!isAssistantMessage ? "U" : "AI"}
      </div>
      <div className="flex-1">
        <div
          className={`p-3 rounded-lg ${
            !isAssistantMessage ? "bg-blue-500 text-white" : "bg-white border shadow-sm"
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

