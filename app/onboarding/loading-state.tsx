import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ 
  message = 'Loading...', 
  className = '' 
}: LoadingStateProps) {
  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">{message}</span>
    </div>
  )
} 