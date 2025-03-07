import { socketService } from '@/lib/socket'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = import.meta.env.VITE_API_URL

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ChatResponse = {
  responseId: string
  response: string
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': socketService.getClientId() ?? '',
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async (): Promise<Message[]> => {
      const response = await fetch(`${API_BASE_URL}/messages`)
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      return response.json()
    },
  })
}

export const useSendFeedback = () => {
  return useMutation({
    mutationFn: async ({
      messageId,
      feedback,
      comment,
    }: {
      messageId: string
      feedback: 'positive' | 'negative'
      comment: string
    }) => {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, feedback, comment }),
      })

      if (!response.ok) {
        throw new Error('Failed to send feedback')
      }

      return response.json()
    },
  })
}