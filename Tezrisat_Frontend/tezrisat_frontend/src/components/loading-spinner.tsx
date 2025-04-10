export function LoadingSpinner() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-teal-200/30 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-transparent border-t-teal-400 rounded-full animate-spin"></div>
    </div>
  )
}

