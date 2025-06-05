"use client"

import { LogIn, UserPlus } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";

export function Header() {
  const { isAuthenticated, userData, logout } = useUser();
  const router = useRouter();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-2xl gap-3">
          TAQ
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && userData ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{userData.full_name}</p>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
  )
}