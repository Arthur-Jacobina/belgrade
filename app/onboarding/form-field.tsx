interface FormFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  type?: string
  className?: string
}

export function FormField({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  type = 'text',
  className = ''
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
      />
    </div>
  )
} 