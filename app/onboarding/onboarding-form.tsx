'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { useToast } from '@/hooks/use-toast'
import { createUser } from '@/lib/supabase'
import { Loader2, Check, AlertCircle, ArrowRight } from 'lucide-react'
import { 
  FormContainer, 
  FormField, 
  FormGroup, 
  FormButton, 
  LoadingState, 
  FormMessage 
} from './'

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
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <Check className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return isFormComplete ? <ArrowRight className="h-4 w-4" /> : null
    }
  }

  const getButtonVariant = () => {
    if (submissionStatus === 'success') return 'success'
    if (submissionStatus === 'error') return 'error'
    return 'primary'
  }

  // Show loading spinner during initial check
  if (initialCheck || isLoadingUserData) {
    return <LoadingState message="Checking account status..." />
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <FormField
          id="fullName"
          label="Username"
          placeholder="Enter your username"
          value={formData.fullName}
          onChange={(value) => setFormData({ ...formData, fullName: value })}
          required
          disabled={isLoading}
        />
        <FormField
          id="organizationName"
          label="Organization Name"
          placeholder="Enter organization name"
          value={formData.organizationName}
          onChange={(value) => setFormData({ ...formData, organizationName: value })}
          disabled={isLoading}
        />
      </FormGroup>

      <FormButton
        type="submit"
        disabled={isLoading || !isFormComplete}
        loading={isLoading}
        variant={getButtonVariant()}
        icon={getButtonIcon()}
      >
        {getButtonText()}
      </FormButton>

      {!isFormComplete && !isLoading && (
        <FormMessage message="Please enter a username to continue" />
      )}
    </FormContainer>
  )
} 