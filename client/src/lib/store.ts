import { create } from 'zustand'

type ChatState = {
  input: string
  status: 'idle' | 'streaming' | 'generating' | 'thinking' | 'error' | 'complete' | 'processing'
  isConnected: boolean
  setInput: (input: string) => void
  setStatus: (status: ChatState['status']) => void
  setIsConnected: (isConnected: boolean) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  input: '',
  status: 'idle',
  isConnected: false,
  setInput: (input) => set({ input }),
  setStatus: (status) => set({ status }),
  setIsConnected: (isConnected) => set({ isConnected }),
  reset: () => set({ input: '', status: 'idle' })
}))