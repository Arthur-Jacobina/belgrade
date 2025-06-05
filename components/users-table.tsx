'use client'

import { useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { Loader2, User as UserIcon, Mail, Wallet } from 'lucide-react'

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        console.error('Error fetching users:', error)
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Error loading users: {error}</p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
        <p className="text-muted-foreground mb-4">
          No users have been created yet. Create your first user by going through the onboarding process.
        </p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users ({users.length})</h2>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Wallet
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm">
                      {user.organization_name || 'No organization'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.wallet ? (
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No wallet</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 