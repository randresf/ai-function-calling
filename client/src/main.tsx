import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 min-w-screen">
        <header className="border-b p-4 bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-center">AI Assistant</h1>
        </header>

        <main className="flex-1 min-w-screen">
          <App />
          </main>
      </div>
    </QueryClientProvider>
)
