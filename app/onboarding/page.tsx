import { Metadata } from 'next'
import { OnboardingForm } from '@/components/onboarding-form'

export const metadata: Metadata = {
  title: 'Welcome | Taq',
  description: 'Complete your profile setup',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Taq!</h1>
          <p className="text-muted-foreground text-lg">
            Let's set up your account to get started
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <OnboardingForm />
        </div>
      </div>
    </div>
  )
} 