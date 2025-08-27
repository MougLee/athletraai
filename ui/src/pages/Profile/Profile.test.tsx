import { screen } from '@testing-library/react';
import { UserState } from 'contexts';
import { UserContext } from 'contexts/UserContext/UserContext';
import { renderWithClient } from 'tests';
import { Profile } from './Profile';
import { LanguageProvider } from 'contexts/LanguageContext';
import { useAuth, useApiKeyState } from 'hooks/auth';

// Mock the useAuth hook
vi.mock('hooks/auth', () => ({
  useAuth: vi.fn(),
  useApiKeyState: vi.fn(),
}));

const mockState: UserState = {
  user: {
    login: 'user-login',
    email: 'email@address.pl',
    createdOn: '2020-10-09T09:57:17.995288Z',
  },
};

const dispatch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  
  // Set up default mocks - return a valid API key so PasswordDetails renders
  vi.mocked(useApiKeyState).mockReturnValue([{ apiKey: 'test-api-key' }, vi.fn()]);
});

test('renders headers', () => {
  localStorage.setItem('apiKey', '{ "apiKey": "test-api-key" }');
  
  // Mock useAuth to return authenticated state
  vi.mocked(useAuth).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: mockState.user as any,
    apiKey: 'test-api-key',
  });

  renderWithClient(
    <LanguageProvider>
      <UserContext.Provider value={{ state: mockState, dispatch }}>
        <Profile />
      </UserContext.Provider>
    </LanguageProvider>
  );

  // Check for the actual text that the components render
  expect(screen.getByText('Profile details')).toBeInTheDocument();
  expect(screen.getByText('Password details')).toBeInTheDocument();
});
