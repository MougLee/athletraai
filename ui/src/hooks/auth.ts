import { useLocalStorage } from '@uidotdev/usehooks';
import { useGetUser } from 'api/apiComponents';
import { useUserContext } from 'contexts/UserContext/UserContext';
import { useEffect, useState } from 'react';
import { STORAGE_API_KEY } from '../consts';
import { useQueryClient } from '@tanstack/react-query';

export interface ApiKeyState {
  apiKey: string | null;
}

export const useApiKeyState = () =>
  useLocalStorage<ApiKeyState | null>(STORAGE_API_KEY);

// Main authentication hook that manages both auth state and user data
export const useAuth = () => {
  const [apiKeyState] = useApiKeyState();
  const { state: { user }, dispatch } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Determine authentication state
  const isAuthenticated = Boolean(apiKeyState?.apiKey);

  // Fetch user data when authenticated
  const { data: fetchedUser, isSuccess, isError, isLoading: userLoading } = useGetUser(
    isAuthenticated && apiKeyState?.apiKey ? { headers: { Authorization: `Bearer ${apiKeyState.apiKey}` } } : {},
    {
      enabled: isAuthenticated && Boolean(apiKeyState?.apiKey),
      retry: false,
    }
  );

  useEffect(() => {
    if (apiKeyState === undefined) {
      // localStorage still loading, but set a timeout to prevent infinite loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    // localStorage has loaded, we can determine authentication state
    if (isAuthenticated) {
      if (isSuccess && fetchedUser && !user) {
        // User data fetched successfully but not in context yet
        dispatch({ type: 'LOG_IN', user: fetchedUser });
      }
    } else {
      if (user) {
        dispatch({ type: 'LOG_OUT' });
        queryClient.resetQueries({ queryKey: ['/user'] });
      }
    }

    setIsLoading(false);
  }, [apiKeyState, user, fetchedUser, isSuccess, isError, isAuthenticated, dispatch, queryClient]);

  // Return combined state
  const isLoadingOverall = isLoading || (isAuthenticated && userLoading);

  return {
    isAuthenticated,
    isLoading: isLoadingOverall,
    user: user || fetchedUser, // Return user from context or fetched data
    apiKey: apiKeyState?.apiKey,
  };
};
