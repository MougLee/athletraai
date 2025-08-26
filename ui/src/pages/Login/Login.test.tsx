import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { UserContext } from 'contexts/UserContext/User.context';
import { initialUserState } from 'contexts/UserContext/UserContext.constants';
import { renderWithClient } from 'tests';
import { Login } from './Login';
import { useGetUser, usePostUserLogin } from 'api/apiComponents';
import { beforeEach, afterEach, vi } from 'vitest';
import { LanguageProvider } from 'contexts/LanguageContext';

vi.mock('api/apiComponents', () => ({
  useGetUser: vi.fn(),
  usePostUserLogin: vi.fn(),
}));

// Mock the validation schema creation
vi.mock('./Login.validations', () => ({
  createValidationSchema: vi.fn(() => ({
    validate: vi.fn().mockResolvedValue(true),
  })),
}));

// Helper function to create a complete mutation mock
const createMutationMock = (overrides: any = {}) => ({
  mutateAsync: vi.fn(),
  reset: vi.fn(),
  data: undefined,
  isSuccess: false,
  isError: false,
  isPending: false,
  isIdle: true,
  error: null,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  
  // Set up default mocks
  (useGetUser as any).mockReturnValue({
    data: undefined,
    isSuccess: false,
    isPending: false,
    isError: false,
  });
  
  (usePostUserLogin as any).mockReturnValue(createMutationMock());
});

afterEach(() => {
  vi.restoreAllMocks();
});

const createTestWrapper = (children: React.ReactNode) => (
  <MemoryRouter initialEntries={['/login']}>
    <LanguageProvider>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch: vi.fn() }}
      >
        {children}
      </UserContext.Provider>
    </LanguageProvider>
  </MemoryRouter>
);

test('<Login /> should render the header', () => {
  const mockMutate = vi.fn();
  
  (usePostUserLogin as any).mockReturnValue(
    createMutationMock({
      mutateAsync: mockMutate,
      data: { apiKey: 'test-api-key' },
      isSuccess: true,
      isIdle: false,
    })
  );

  renderWithClient(createTestWrapper(<Login />));

  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('<Login /> should handle the login form submission through the Enter key press', async () => {
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();

  // Mock the login mutation
  (usePostUserLogin as any).mockReturnValue(
    createMutationMock({
      mutateAsync: mockMutate.mockImplementationOnce(() => {
        onSuccess({ apiKey: 'test-api-key' });
      }),
      data: { apiKey: 'test-api-key' },
      isSuccess: true,
      isIdle: false,
    })
  );

  // Mock the user fetch that happens after successful login
  (useGetUser as any).mockReturnValue({
    data: {
      user: {
        login: 'test-user',
        email: 'test-user@example.com',
        createdOn: '2023-10-01T12:00:00Z',
      },
    },
    isSuccess: true,
    isPending: false,
    isError: false,
  });

  renderWithClient(createTestWrapper(<Login />));

  await userEvent.type(screen.getByLabelText('Login or Email'), 'test-login');
  await userEvent.type(screen.getByLabelText('Password'), 'test-password');
  await userEvent.keyboard('{Enter}');

  await screen.findByRole('success');

  expect(mockMutate).toHaveBeenCalledWith({
    body: {
      loginOrEmail: 'test-login',
      password: 'test-password',
    },
  });

  expect(onSuccess).toHaveBeenCalledWith({
    apiKey: 'test-api-key',
  });
});

test('<Login /> should handle successful login attempt through the submit button click', async () => {
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();
  
  // Mock the login mutation
  (usePostUserLogin as any).mockReturnValue(
    createMutationMock({
      mutateAsync: mockMutate.mockImplementationOnce(() =>
        onSuccess({ apiKey: 'test-api-key' })
      ),
      data: { apiKey: 'test-api-key' },
      isSuccess: true,
      isIdle: false,
    })
  );

  // Mock the user fetch that happens after successful login
  (useGetUser as any).mockReturnValue({
    data: {
      user: {
        login: 'test-user',
        email: 'test-user@example.com',
        createdOn: '2023-10-01T12:00:00Z',
      },
    },
    isSuccess: true,
    isPending: false,
    isError: false,
  });

  renderWithClient(createTestWrapper(<Login />));

  await userEvent.type(screen.getByLabelText('Login or Email'), 'test-login');
  await userEvent.type(screen.getByLabelText('Password'), 'test-password');
  await userEvent.click(screen.getByText('Sign In'));

  await screen.findByRole('success');

  expect(mockMutate).toHaveBeenCalledWith({
    body: {
      loginOrEmail: 'test-login',
      password: 'test-password',
    },
  });

  expect(onSuccess).toHaveBeenCalledWith({
    apiKey: 'test-api-key',
  });
});

test('<Login /> should handle failed login attempt', async () => {
  const mockMutate = vi.fn();
  
  (usePostUserLogin as any).mockReturnValue(
    createMutationMock({
      mutateAsync: mockMutate,
      data: undefined,
      isSuccess: false,
      isError: true,
      error: 'Test error',
      isIdle: false,
    })
  );

  (useGetUser as any).mockReturnValue({
    data: {
      user: {
        login: 'test-user',
        email: 'test-user@example.com',
        createdOn: '2023-10-01T12:00:00Z',
      },
    },
    isSuccess: false,
    isPending: false,
    isError: false,
  });

  renderWithClient(createTestWrapper(<Login />));

  await userEvent.type(screen.getByLabelText('Login or Email'), 'test-login');
  await userEvent.type(screen.getByLabelText('Password'), 'test-password');
  await userEvent.click(screen.getByText('Sign In'));

  await screen.findByRole('error');

  expect(mockMutate).toHaveBeenCalledWith({
    body: { loginOrEmail: 'test-login', password: 'test-password' },
  });
});
