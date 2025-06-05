'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLogin } from '@privy-io/react-auth'
import { useUser } from '@/hooks/use-user'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function LoginButton() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useLogin({
    onComplete: async (params) => {
      await handleUserVerification(params.user, params.isNewUser)
    }
  })

  const { 
    isPrivyReady, 
    isAuthenticated, 
    userData, 
    fetchUserData,
    isLoadingUserData 
  } = useUser()

  const handleUserVerification = async (privyUser: any, isNewUser: boolean) => {
    try {
      // Check if user exists in Supabase
      const existingUser = await fetchUserData(privyUser.id)
      
      if (existingUser) {
        // User exists, redirect to home
        toast({
          title: 'Welcome back!',
          variant: 'success'
        })
        router.push('/')
      } else {
        // User doesn't exist, redirect to onboarding
        toast({
          title: 'Welcome!',
          description: 'Please complete your profile setup.',
        })
        router.push('/onboarding')
      }
    } catch (error) {
      console.log('Error during user verification:', error)
      // toast({
      //   title: 'Error',
      //   description: 'Failed to verify user. Please create an account.',
      //   variant: 'destructive'
      // })
    }
  }

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && userData) {
      router.push('/')
    }
  }, [isAuthenticated, userData, router])

  if (!isPrivyReady) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (isLoadingUserData) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Verifying account...</span>
      </div>
    )
  }

  return (
    <div className="w-full items-center justify-center flex flex-col text-center">
      <button
        className="h-12 text-lg px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        onClick={login}
        disabled={!isPrivyReady}
      >
          <div className="flex items-center">Sign in with Privy</div>
      </button>
    </div>
  )
} 