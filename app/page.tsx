'use client'

import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/navigation'
import { Loader2, LogIn, UserPlus, Send } from 'lucide-react'
import { useSendTransaction } from '@privy-io/react-auth'
import { useState } from 'react'
import { Header } from '@/components/header'

export default function Home() {
  const { 
    isPrivyReady, 
    isAuthenticated, 
    userData, 
    privyUser, 
    logout,
    isLoadingUserData 
  } = useUser()
  const router = useRouter()
  const { sendTransaction } = useSendTransaction()
  const [txHash, setTxHash] = useState<string>('')
  const [isTransacting, setIsTransacting] = useState(false)

  const handleMockTransaction = async () => {
    if (!isAuthenticated || !privyUser) {
      console.log('User not authenticated')
      return
    }

    setIsTransacting(true)
    try {
      // Mock transaction - sending a very small amount to a test address
      const tx = await sendTransaction({
        to: '0x0000000000000000000000000000000000000001', // Burn address for testing
        value: 1000000000000000, // 0.001 ETH in wei
      })
      
      setTxHash(tx.hash)
      console.log('Transaction sent:', tx.hash)
    } catch (error) {
      console.error('Transaction failed:', error)
    } finally {
      setIsTransacting(false)
    }
  }

  if (!isPrivyReady || isLoadingUserData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Mock Transaction Section - Only show when authenticated */}
          {isAuthenticated && userData && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Send className="h-5 w-5" />
                Blockchain Transaction Test
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Test your Privy embedded wallet by sending a mock transaction to the blockchain.
                  This will send 0.001 ETH to a test address.
                </p>
                <button
                  onClick={handleMockTransaction}
                  disabled={isTransacting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
                    isTransacting
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isTransacting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Transaction...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Mock Transaction
                    </>
                  )}
                </button>
                {txHash && (
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Transaction Successful! 🎉</p>
                    <p className="text-xs text-muted-foreground break-all">
                      <strong>Hash:</strong> {txHash}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      You can view this transaction on a blockchain explorer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
