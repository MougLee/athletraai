import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { UserState } from 'contexts';
import { UserContext } from 'contexts/UserContext/User.context';
import { initialUserState } from 'contexts/UserContext/UserContext.constants';
import { renderWithClient } from 'tests';
import { Routes } from './Routes';
import { LanguageProvider } from 'contexts/LanguageContext';
import { useAuth, useApiKeyState } from 'hooks/auth';

// Mock the useAuth hook
vi.mock('hooks/auth', () => ({
  useAuth: vi.fn(),
  useApiKeyState: vi.fn(),
}));

const loggedUserState: UserState = {
  user: {
    login: 'user-login',
    email: 'email@address.pl',
    createdOn: '2020-10-09T09:57:17.995288Z',
  },
};

const dispatch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  
  // Set up default mocks
  vi.mocked(useApiKeyState).mockReturnValue([null, vi.fn()]);
});

test('<Routes /> should render the main route', () => {
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
          <Routes />
        </UserContext.Provider>
      </LanguageProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Welcome to Athletra AI!')).toBeInTheDocument();
});

test('<Routes /> should render protected route for unlogged user', () => {
  // Mock useAuth to return unauthenticated state
  vi.mocked(useAuth).mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    apiKey: null,
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/main']}>
      <LanguageProvider>
        <UserContext.Provider value={{ state: initialUserState, dispatch }}>
          <Routes />
        </UserContext.Provider>
      </LanguageProvider>
    </MemoryRouter>
  );

  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('<Routes /> should render protected route for logged-in user', () => {
  // Mock useAuth to return authenticated state
  vi.mocked(useAuth).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: loggedUserState.user as any,
    apiKey: 'test-api-key',
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/main']}>
      <LanguageProvider>
        <UserContext.Provider value={{ state: loggedUserState, dispatch }}>
          <Routes />
        </UserContext.Provider>
      </LanguageProvider>
    </MemoryRouter>
  );

  expect(
    screen.getByText('Shhhh, this is a secret place.')
  ).toBeInTheDocument();
});

test('<Routes /> should render not found page', () => {
  // Mock useAuth to return authenticated state
  vi.mocked(useAuth).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: loggedUserState.user as any,
    apiKey: 'test-api-key',
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/not-specified-route']}>
      <LanguageProvider>
        <UserContext.Provider value={{ state: loggedUserState, dispatch }}>
          <Routes />
        </UserContext.Provider>
      </LanguageProvider>
    </MemoryRouter>
  );

  expect(
    screen.getByText("You shouldn't be here for sure :)")
  ).toBeInTheDocument();
});
