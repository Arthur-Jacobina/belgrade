import { Metadata } from 'next'
import { LoginButton } from '@/app/login/login-button'

export const metadata: Metadata = {
  title: 'Login | Taq',
  description: 'Sign in to your Taq account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Taq</h1>
        </div>
          <LoginButton />
      </div>
    </div>
  )
}
