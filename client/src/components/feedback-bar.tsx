import { useState } from "react"
import { useSendFeedback } from "../lib/api"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface FeedbackBarProps {
  messageId: string
}

export default function FeedbackBar({ messageId }: FeedbackBarProps) {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [comment, setComment] = useState("")
  const { mutate: sendFeedback, isPending } = useSendFeedback()

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type)

    if (type === "negative") {
      setExpanded(true)
    } else {
      // Submit positive feedback immediately
      sendFeedback({
        messageId,
        feedback: type,
        comment: "",
      })
    }
  }

  const submitComment = () => {
    sendFeedback(
      {
        messageId,
        feedback: feedback as "positive" | "negative",
        comment,
      },
      {
        onSuccess: () => {
          setExpanded(false)
        },
      }
    )
  }

  return (
    <div className="text-sm text-gray-500">
      <div className="flex items-center gap-4">
        <span>Was this response helpful?</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleFeedback("positive")}
            className={`p-1 rounded hover:bg-gray-100 ${feedback === "positive" ? "text-green-500" : ""}`}
            aria-label="Thumbs up"
            disabled={isPending}
          >
            <ThumbsUp size={16} />
          </button>
          <button
            onClick={() => handleFeedback("negative")}
            className={`p-1 rounded hover:bg-gray-100 ${feedback === "negative" ? "text-red-500" : ""}`}
            aria-label="Thumbs down"
            disabled={isPending}
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What could be improved about this response?"
            className="w-full p-2 text-sm border rounded-md"
            rows={3}
            disabled={isPending}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setExpanded(false)}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              onClick={submitComment}
              className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
              disabled={isPending || !comment.trim()}
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {feedback === "positive" && !expanded && <div className="mt-1 text-green-500">Thanks for your feedback!</div>}
    </div>
  )
}

