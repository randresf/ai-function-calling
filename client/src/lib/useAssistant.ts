import { useEffect } from 'react'
import { useChatStore } from './store'
import { useSendMessage } from './api'

export function useAssistant() {
  const { input, status, setInput, setStatus, reset } = useChatStore()
  const { mutate: sendMessage } = useSendMessage()

  useEffect(() => {
    const handleSocketMessage = (event: CustomEvent) => {
      console.log(event.detail)
      const { type, message } = event.detail
      if (message?.status) {
        setStatus(message.status)
      }
      if (type === 'connected') {
        setStatus('idle')
      } else if (type === 'error') {
        setStatus('error')
      }
    }

    window.addEventListener('socket-message' as any, handleSocketMessage)
    return () => {
      window.removeEventListener('socket-message' as any, handleSocketMessage)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setStatus('processing')
    try {
      sendMessage(input)
      setInput('')
      setStatus('complete')
    } catch (error) {
      setStatus('error')
      console.error('Failed to send message:', error)
    }
  }

  return {
    input,
    status,
    handleInputChange,
    handleSubmit,
    reset,
  }
}