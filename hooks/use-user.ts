import { useUserStore } from '@/lib/store/user-store';
import { usePrivy } from '@privy-io/react-auth';
import useAuthRefresh from '@/hooks/use-auth-refresh';

// This hook provides access to user data from the store and Privy
export function useUser() {
  const {
    privyUser,
    userData,
    setPrivyUser,
    setUserData,
    clearUser,
    isLoadingUserData,
    fetchUserData,
  } = useUserStore();

  const { ready, authenticated, user: originalPrivyUser } = usePrivy();
  const { refreshToken, logout, fetchWithRefresh } = useAuthRefresh();

  // Enhanced logout function that sets logout flags
  const enhancedLogout = async () => {
    try {
      // Set logout flags to prevent race conditions
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('logging-out', 'true');
        (window as any).__LOGOUT_IN_PROGRESS = true;
      }

      // Clear store first
      clearUser();
      
      // Then logout from Privy
      await logout();
      
      // Clear logout flags after logout is complete
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('logging-out');
        delete (window as any).__LOGOUT_IN_PROGRESS;
      }
    } catch (error) {
      console.error('Enhanced logout failed:', error);
      // Clear flags even if logout fails
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('logging-out');
        delete (window as any).__LOGOUT_IN_PROGRESS;
      }
    }
  };

  return {
    // Privy state
    isPrivyReady: ready,
    isAuthenticated: authenticated,
    privyUser: originalPrivyUser || privyUser,
    
    // Supabase user data
    userData,
    isLoadingUserData,
    
    // State setters
    setPrivyUser,
    setUserData,
    clearUser,
    
    // Data fetching
    fetchUserData,
    
    // Auth actions
    refreshToken,
    logout: enhancedLogout,
    fetchWithRefresh,
  };
} 