import { useAuth } from './auth';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from 'contexts/UserContext/UserContext';
import { ReactNode } from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>{children}</UserContextProvider>
    </QueryClientProvider>
  );
};

describe('useAuth', () => {
  test('useAuth() should be defined and return expected structure', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
    expect(typeof result.current.isAuthenticated).toBe('boolean');
    expect(typeof result.current.isLoading).toBe('boolean');
    expect('user' in result.current).toBe(true);
    expect('apiKey' in result.current).toBe(true);
  });

  test('useAuth() should handle initial state correctly', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // Initially should be loading or unauthenticated
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeUndefined();
    expect(result.current.apiKey).toBeUndefined();
  });
});
