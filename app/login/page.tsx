import { Metadata } from 'next'
import { LoginButton } from '@/app/login/login-button'

export const metadata: Metadata = {
  title: 'Login | Taq',
  description: 'Sign in to your Taq account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-8 bg-background">
        <LoginButton />
    </div>
  )
}
