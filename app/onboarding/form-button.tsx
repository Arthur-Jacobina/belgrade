import { ReactNode } from 'react'

interface FormButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'success' | 'error'
  icon?: ReactNode
  className?: string
}

const getVariantStyles = (variant: FormButtonProps['variant']) => {
  switch (variant) {
    case 'success':
      return 'bg-green-600 hover:bg-green-700'
    case 'error':
      return 'bg-red-600 hover:bg-red-700'
    default:
      return 'bg-primary hover:bg-primary/90'
  }
}

export function FormButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'primary',
  icon,
  className = ''
}: FormButtonProps) {
  const baseStyles = 'w-full transition-all duration-300 relative overflow-hidden group h-12 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
  const variantStyles = getVariantStyles(variant)
  
  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className="relative flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  )
} 