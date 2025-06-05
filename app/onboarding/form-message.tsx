interface FormMessageProps {
  message: string
  type?: 'info' | 'warning' | 'error' | 'success'
  className?: string
}

const getMessageStyles = (type: FormMessageProps['type']) => {
  switch (type) {
    case 'error':
      return 'text-red-500'
    case 'success':
      return 'text-green-500'
    case 'warning':
      return 'text-yellow-500'
    default:
      return 'text-muted-foreground'
  }
}

export function FormMessage({ 
  message, 
  type = 'info', 
  className = '' 
}: FormMessageProps) {
  const messageStyles = getMessageStyles(type)
  
  return (
    <p className={`text-xs text-center mt-2 ${messageStyles} ${className}`}>
      {message}
    </p>
  )
} 