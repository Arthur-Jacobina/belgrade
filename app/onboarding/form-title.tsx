interface FormTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export function FormTitle({ title, subtitle, className = '' }: FormTitleProps) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      )}
    </div>
  )
} 