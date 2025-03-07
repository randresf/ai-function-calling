export default function LoadingIndicator() {
  return (
    <div className="p-3 bg-white border rounded-lg shadow-sm">
      <div className="flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "300ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "600ms" }}></div>
      </div>
    </div>
  )
}

