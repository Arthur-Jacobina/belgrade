'use client'

import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

let toastCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((newToast: Omit<Toast, 'id'>) => {
    const id = (++toastCounter).toString()
    const toastWithId = { ...newToast, id }
    
    setToasts((prevToasts) => [...prevToasts, toastWithId])
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id)
    }, 5000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return {
    toasts,
    toast,
    dismissToast,
  }
} 