'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { useToast } from '@/hooks/use-toast'
import { createUser } from '@/lib/supabase'
import { Loader2, Check, AlertCircle, ArrowRight } from 'lucide-react'

interface OnboardingFormData {
  organizationName: string
  fullName: string
  email: string
  wallet?: string
}

type SubmissionStatus = 'idle' | 'creating-user' | 'success' | 'error'

export function OnboardingForm() {
  const router = useRouter()
  const { 
    privyUser, 
    userData, 
    isLoadingUserData, 
    setUserData,
    isAuthenticated
  } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [initialCheck, setInitialCheck] = useState(true)

  const [formData, setFormData] = useState<OnboardingFormData>({
    organizationName: '',
    fullName: '',
    email: '',
    wallet: '',
  })

  // Update form data when Privy user is available
  useEffect(() => {
    if (privyUser) {
      setFormData(prev => ({
        ...prev,
        email: privyUser.email?.address || '',
        wallet: privyUser.wallet?.address || '',
      }))
    }
  }, [privyUser])

  const isFormComplete = formData.fullName.trim() !== ''

  // Check if user already exists when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (userData) {
      toast({
        title: 'Welcome back!',
        description: 'You already have an account, redirecting to home.',
      })
      setTimeout(() => {
        router.replace('/')
      }, 1000)
    }
    setInitialCheck(false)
  }, [userData, isAuthenticated, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!privyUser) {
      toast({
        title: 'Error',
        description: 'No authenticated user found. Please login first.',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    setSubmissionStatus('creating-user')

    try {
      // Create user directly with Supabase
      const newUser = await createUser({
        privyId: privyUser.id,
        fullName: formData.fullName,
        email: formData.email,
        wallet: formData.wallet,
        organizationName: formData.organizationName,
      })

      if (newUser) {
        setSubmissionStatus('success')
        setUserData(newUser) // Update the store
        toast({
          title: 'Welcome to Taq!',
          description: 'Your account has been created successfully.',
          variant: 'success'
        })

        // Redirect to home after success
        setTimeout(() => {
          router.replace('/')
        }, 1500)
      } else {
        throw new Error('Failed to create user')
      }
    } catch (error: any) {
      console.error('Error in onboarding:', error)
      setSubmissionStatus('error')

      toast({
        title: 'Error',
        description: error.message || 'Failed to complete onboarding',
        variant: 'destructive',
      })
    } finally {
      if (submissionStatus !== 'success') {
        setIsLoading(false)
      }
    }
  }

  const getButtonText = () => {
    switch (submissionStatus) {
      case 'creating-user':
        return 'Setting Up Your Account...'
      case 'success':
        return 'Success! Redirecting...'
      case 'error':
        return 'Try Again'
      default:
        return isFormComplete ? 'Complete Setup' : 'Enter Username to Continue'
    }
  }

  const getButtonIcon = () => {
    switch (submissionStatus) {
      case 'creating-user':
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      case 'success':
        return <Check className="mr-2 h-4 w-4" />
      case 'error':
        return <AlertCircle className="mr-2 h-4 w-4" />
      default:
        return isFormComplete ? <ArrowRight className="mr-2 h-4 w-4" /> : null
    }
  }

  const getButtonVariant = () => {
    if (submissionStatus === 'success') return 'bg-green-600 hover:bg-green-700'
    if (submissionStatus === 'error') return 'bg-red-600 hover:bg-red-700'
    return 'bg-primary hover:bg-primary/90'
  }

  // Show loading spinner during initial check
  if (initialCheck || isLoadingUserData) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Checking account status...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Username *
          </label>
          <input
            id="fullName"
            placeholder="Enter your username"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">
            From your Privy account
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="organizationName" className="text-sm font-medium">
            Organization Name
          </label>
          <input
            id="organizationName"
            placeholder="Enter organization name"
            value={formData.organizationName}
            onChange={(e) =>
              setFormData({ ...formData, organizationName: e.target.value })
            }
            disabled={isLoading}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
        </div>

        {formData.wallet && (
          <div className="space-y-2">
            <label htmlFor="wallet" className="text-sm font-medium">
              Wallet Address
            </label>
            <input
              id="wallet"
              value={formData.wallet}
              disabled
              className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Connected from your Privy wallet
            </p>
          </div>
        )}
      </div>

      <button
        className={`w-full transition-all duration-300 relative overflow-hidden group h-12 px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${getButtonVariant()}`}
        type="submit"
        disabled={isLoading || !isFormComplete}
      >
        <span className="relative flex items-center justify-center">
          {getButtonIcon()}
          {getButtonText()}
        </span>
      </button>

      {!isFormComplete && !isLoading && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Please enter a username to continue
        </p>
      )}
    </form>
  )
} 