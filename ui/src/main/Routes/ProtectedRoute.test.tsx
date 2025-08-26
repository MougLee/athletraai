import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { UserContext } from 'contexts/UserContext/User.context';
import { initialUserState } from 'contexts/UserContext/UserContext.constants';
import { renderWithClient } from 'tests';
import { Login } from 'pages';
import { ProtectedRoute } from './ProtectedRoute';
import { LanguageProvider } from 'contexts/LanguageContext';
import { useAuth, useApiKeyState } from 'hooks/auth';

// Mock the useAuth hook
vi.mock('hooks/auth', () => ({
  useAuth: vi.fn(),
  useApiKeyState: vi.fn(),
}));

const dispatch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  
  // Set up default mocks
  vi.mocked(useApiKeyState).mockReturnValue([null, vi.fn()]);
});

test('<ProtectedRoute /> should not render protected route for anonymous user', () => {
  // Mock useAuth to return unauthenticated state
  vi.mocked(useAuth).mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    apiKey: null,
  });

  renderWithClient(
    <MemoryRouter initialEntries={['']}>
      <LanguageProvider>
        <UserContext.Provider value={{ state: initialUserState, dispatch }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route index element={<>Protected Text</>} />
            </Route>
          </Routes>
        </UserContext.Provider>
      </LanguageProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('<ProtectedRoute /> should render protected route to a logged-in user', () => {
  // Mock useAuth to return authenticated state
  vi.mocked(useAuth).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: {
      createdOn: '2023-10-01T12:00:00Z',
      login: 'test-user',
      email: 'test-user@example.com',
    },
    apiKey: 'test-api-key',
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/protected-page']}>
      <LanguageProvider>
        <UserContext.Provider
          value={{
            state: {
              user: {
                createdOn: '2023-10-01T12:00:00Z',
                login: 'test-user',
                email: 'test-user@example.com',
              },
            },
            dispatch,
          }}
        >
          <Routes>
            <Route path="/protected-page" element={<ProtectedRoute />}>
              <Route index element={<>Protected Text</>} />
            </Route>
            <Route path="/login" element={<>Login page</>} />
          </Routes>
        </UserContext.Provider>
      </LanguageProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Protected Text')).toBeVisible();
});
