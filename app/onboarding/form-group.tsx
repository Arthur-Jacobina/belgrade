import { ReactNode } from 'react'

interface FormGroupProps {
  children: ReactNode
  className?: string
}

export function FormGroup({ children, className = '' }: FormGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  )
} 