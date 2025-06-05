import { Metadata } from 'next'
import { OnboardingForm, FormTitle } from '@/app/onboarding'

export const metadata: Metadata = {
  title: 'Welcome | Taq',
  description: 'Complete your profile setup',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <FormTitle 
          title="Welcome to Taq!"
          subtitle="Let's set up your account to get started"
        />
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <OnboardingForm />
        </div>
      </div>
    </div>
  )
} 