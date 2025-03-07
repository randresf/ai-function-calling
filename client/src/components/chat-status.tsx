import { useChatStore } from "@/lib/store"

export default function ChatStatus() {
  const { status } = useChatStore()
  if (status === 'idle' || status === 'complete') return null
  return (
    <div className="mt-2 text-sm text-gray-500">
      {status === 'thinking' && 'Thinking...'}
      {status === 'processing' && 'Processing...'}
      {status === 'generating' && 'Generating response...'}
      {status === 'streaming' && 'Receiving response...'}
      {status === 'error' && (
        <span className="text-red-500">An error occurred</span>
      )}
    </div>
  )
}