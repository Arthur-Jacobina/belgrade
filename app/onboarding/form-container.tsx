import { ReactNode } from 'react'

interface FormContainerProps {
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}

export function FormContainer({ 
  children, 
  onSubmit, 
  className = '' 
}: FormContainerProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  )
} 