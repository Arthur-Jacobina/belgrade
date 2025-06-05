import { create } from 'zustand'
import { User as PrivyUser } from '@privy-io/react-auth'
import { User, verifyUser, createUser, getUserById } from '@/lib/supabase'

interface UserStore {
  privyUser: PrivyUser | null
  userData: User | null
  isLoadingUserData: boolean
  setPrivyUser: (user: PrivyUser | null) => void
  setUserData: (user: User | null) => void
  clearUser: () => void
  fetchUserData: (identifier: string) => Promise<User | null>
}

export const useUserStore = create<UserStore>((set, get) => ({
  privyUser: null,
  userData: null,
  isLoadingUserData: false,
  
  setPrivyUser: (user) => set({ privyUser: user }),
  
  setUserData: (user) => set({ userData: user }),
  
  clearUser: () => set({ privyUser: null, userData: null, isLoadingUserData: false }),
  
  fetchUserData: async (identifier: string) => {
    set({ isLoadingUserData: true })
    try {
      let userData: User | null = null;
      
      // Try to determine if it's a UUID (regular user ID) or Privy ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
      
      if (isUUID) {
        // It's a regular user ID
        console.log('[UserStore] Fetching user by ID:', identifier);
        userData = await getUserById(identifier);
      } else {
        // It's likely a Privy ID
        console.log('[UserStore] Fetching user by Privy ID:', identifier);
        userData = await verifyUser(identifier);
      }
      
      set({ userData, isLoadingUserData: false });
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ isLoadingUserData: false });
      return null;
    }
  },
})) 