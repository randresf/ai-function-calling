import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useChatStore } from "@/lib/store";

export default function ScrollToBottom({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { status } = useChatStore()
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  // Check if user has scrolled up
  const handleScroll = () => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    // Show button if scrolled up more than 100px from bottom
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100
    setShowScrollButton(isScrolledUp)
  }

  // Scroll to bottom when messages change or when streaming starts/stops
  useEffect(() => {
    if (status === 'idle' || status === 'complete') {
      scrollToBottom()
    }
  }, [status])

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6 relative"
      onScroll={handleScroll}
    >
      {children}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-4 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-opacity z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}