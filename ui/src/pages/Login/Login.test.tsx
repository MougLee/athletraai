import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { UserContext } from 'contexts/UserContext/User.context';
import { initialUserState } from 'contexts/UserContext/UserContext.constants';
import { renderWithClient } from 'tests';
import { Login } from './Login';
import { useGetUser, usePostUserLogin } from 'api/apiComponents';
import { beforeEach, afterEach, vi } from 'vitest';

vi.mock('api/apiComponents', () => ({
  useGetUser: vi.fn(),
  usePostUserLogin: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  
  // Set up default mocks
  (useGetUser as any).mockReturnValue({
    data: undefined,
    isSuccess: false,
    isPending: false,
    isError: false,
  });
  
  (usePostUserLogin as any).mockReturnValue({
    mutateAsync: vi.fn(),
    reset: vi.fn(),
    data: undefined,
    isSuccess: false,
    isError: false,
    isPending: false,
    isIdle: false,
    error: '',
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('<Login /> should render the header', () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();
  
  (usePostUserLogin as any).mockReturnValue({
    mutateAsync: mockMutate,
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    error: '',
    isPending: false,
    isIdle: false,
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Login />
      </UserContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('<Login /> should handle the login form submission through the Enter key press', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();

  // Mock the login mutation
  (usePostUserLogin as any).mockReturnValue({
    mutateAsync: mockMutate.mockImplementationOnce(() => {
      onSuccess({ apiKey: 'test-api-key' });
    }),
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    isPending: false, 
    isIdle: false,
    error: '',
  });

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

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Login />
      </UserContext.Provider>
    </MemoryRouter>
  );

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

  expect(dispatch).toHaveBeenCalledTimes(1);
});

test('<Login /> should handle successful login attempt through the submit button click', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();
  
  // Mock the login mutation
  (usePostUserLogin as any).mockReturnValue({
    mutateAsync: mockMutate.mockImplementationOnce(() =>
      onSuccess({ apiKey: 'test-api-key' })
    ),
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    isPending: false,
    isIdle: false,
    error: '',
  });

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

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Login />
      </UserContext.Provider>
    </MemoryRouter>
  );

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

  expect(dispatch).toHaveBeenCalledTimes(1);
});

test('<Login /> should handle failed login attempt', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();
  
  (usePostUserLogin as any).mockReturnValue({
    mutateAsync: mockMutate,
    reset: vi.fn(),
    data: undefined,
    isSuccess: false,
    isError: true,
    error: 'Test error',
    isPending: false,
  });

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

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Login />
      </UserContext.Provider>
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText('Login or Email'), 'test-login');
  await userEvent.type(screen.getByLabelText('Password'), 'test-password');
  await userEvent.click(screen.getByText('Sign In'));

  await screen.findByRole('error');

  expect(mockMutate).toHaveBeenCalledWith({
    body: { loginOrEmail: 'test-login', password: 'test-password' },
  });
  expect(dispatch).not.toHaveBeenCalled();
});
