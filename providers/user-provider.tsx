'use client';

import { usePrivy, PrivyProvider } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import useAuthRefresh from '@/hooks/use-auth-refresh';

function UserProviderInner({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user: originalPrivyUser } = usePrivy();
  const { setPrivyUser, setUserData, fetchUserData } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { fetchWithRefresh } = useAuthRefresh();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkLogoutStatus = () => {
        const logoutFlag = sessionStorage.getItem('logging-out') === 'true';
        const globalLogoutFlag = !!(window as any).__LOGOUT_IN_PROGRESS;

        if (logoutFlag || globalLogoutFlag) {
          console.log(
            'UserProvider detected logout in progress, blocking auth operations',
          );
          setIsLoggingOut(true);
          return true;
        }
        setIsLoggingOut(false);
        return false;
      };
     
      checkLogoutStatus();

      const interval = setInterval(checkLogoutStatus, 100);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  useEffect(() => {

    if (isLoggingOut) return;

    if (ready) {
      if (authenticated && originalPrivyUser) {
        setPrivyUser(originalPrivyUser);
      } else {
        setPrivyUser(null);
      }
    }
  }, [ready, authenticated, originalPrivyUser, setPrivyUser, isLoggingOut]);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    async function handleUserData() {
      // Check for logout state FIRST before proceeding
      if (typeof window !== 'undefined') {
        const logoutFlag = sessionStorage.getItem('logging-out') === 'true';
        const globalLogoutFlag = !!(window as any).__LOGOUT_IN_PROGRESS;

        if (logoutFlag || globalLogoutFlag || isLoggingOut) {
          // Clear flag only if we're responsible for doing so
          if (logoutFlag) {
            sessionStorage.removeItem('logging-out');
          }
          return;
        }

        // Also check if cookies are missing to prevent reauth attempts
        const hasToken =
          document.cookie.includes('user-token') ||
          document.cookie.includes('refresh-token');
        const hasPrivyToken =
          document.cookie.includes('privy-token') ||
          document.cookie.includes('privy-session');

        if (!hasToken && !hasPrivyToken && authenticated) {
          console.log(
            'No auth cookies found despite authenticated state, likely mid-logout',
          );
          return;
        }
      }

      // Wait for user to be populated
      if (!originalPrivyUser) {
        if (authenticated && retryCount < maxRetries) {
          retryCount++;
          console.log(
            `[UserProvider] Waiting for Privy user data... Retry ${retryCount}/${maxRetries}`,
          );
          setTimeout(handleUserData, retryDelay);
          return;
        } else if (retryCount >= maxRetries) {
          console.error(
            '[UserProvider] Max retries reached waiting for Privy user data',
          );
          return;
        }
        return;
      }

      if (!isMounted) return;

      try {
        if (useUserStore.getState().userData?.id) {
          console.log(
            '[UserProvider] Fetching user data with userData.id:',
            useUserStore.getState().userData?.id,
          );
          try {
            await fetchUserData(useUserStore.getState().userData?.id || '');
            console.log(
              '[UserProvider] Successfully fetched user data for userData.id:',
              useUserStore.getState().userData?.id,
            );

            if (useUserStore.getState().userData) {
              return;
            }
          } catch (error) {
            console.error(
              '[UserProvider] Error fetching data with userData.id, falling back to privyId:',
              error,
            );
          }
        }

        if (!useUserStore.getState().userData) {
          const privyId = originalPrivyUser.id;

          if (!privyId) {
            console.error('[UserProvider] No Privy ID available');
            return;
          }

          console.log(
            '[UserProvider] Attempting to verify user with privyId:',
            privyId,
          );

          try {
            const userData = await fetchUserData(privyId);
            
            if (userData) {
              console.log('[UserProvider] User found in database:', userData.id);
              setUserData(userData);
            } else {
              console.log(
                '[UserProvider] User not found in database - redirecting to onboarding',
              );
              if (pathname !== '/onboarding') {
                toast({
                  title: 'Account Required',
                  description: 'Please create an account to continue.',
                  variant: 'default',
                });
                router.push('/onboarding');
              }
            }
          } catch (error) {
            console.error('[UserProvider] Error verifying user:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('[UserProvider] Error in handleUserData:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user data. Please try again.',
          variant: 'destructive',
        });
      }
    }

    if (authenticated && !isLoggingOut) {
      handleUserData();
    }

    return () => {
      isMounted = false;
    };
  }, [
    authenticated,
    originalPrivyUser,
    router,
    pathname,
    toast,
    fetchUserData,
    setUserData,
    fetchWithRefresh,
    isLoggingOut,
  ]);
  return <>{children}</>;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_APP_ID || "cmbil4wr800i1l20o0469ba6o"}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <UserProviderInner>
        {children}
      </UserProviderInner>
    </PrivyProvider>
  );
} 