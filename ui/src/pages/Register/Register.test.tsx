import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { renderWithClient } from 'tests';
import { Register } from './Register';
import { UserContext } from 'contexts/UserContext/User.context';
import { initialUserState } from 'contexts/UserContext/UserContext.constants';
import { usePostUserRegister } from 'api/apiComponents';

vi.mock('api/apiComponents', () => ({
  usePostUserRegister: vi.fn(),
}));

test('<Register /> should render the header text', () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();
  
  (usePostUserRegister as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    isSuccess: true,
    isPending: false,
    data: { apiKey: 'test-api-key' },
    isError: false,
    error: '',
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Register />
      </UserContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText('Register')).toBeInTheDocument();
});

test('<Register /> should handle successful registration through the submit button click', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();

  (usePostUserRegister as any).mockReturnValue({
    mutate: mockMutate.mockImplementation(async () => {
      onSuccess({ apiKey: 'test-api-key' });
    }),
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    error: '',
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Register />
      </UserContext.Provider>
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText('Login'), 'test-login');
  await userEvent.type(
    screen.getByLabelText('Email address'),
    'test@email.address.pl'
  );
  await userEvent.type(screen.getByLabelText('Password'), 'test-password');
  await userEvent.type(
    screen.getByLabelText('Repeat Password'),
    'test-password'
  );
  await userEvent.click(screen.getByText('Create Account'));

  await screen.findByRole('success');

  // Check that the mutation was called with the expected structure
  expect(mockMutate).toHaveBeenCalledWith({
    body: expect.objectContaining({
      login: 'test-login',
      email: 'test@email.address.pl',
      password: 'test-password',
      repeatedPassword: 'test-password',
      language: expect.stringMatching(/^(en|sl)$/),
      timezone: expect.any(String),
    }),
  });

  expect(onSuccess).toHaveBeenCalledWith({
    apiKey: 'test-api-key',
  });
});

test('<Register /> should handle successful registration through the Enter key press', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();

  (usePostUserRegister as any).mockReturnValue({
    mutate: mockMutate.mockImplementation(async () => {
      onSuccess({ apiKey: 'test-api-key' });
    }),
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    error: '',
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Register />
      </UserContext.Provider>
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText('Login'), 'test-login');
  await userEvent.type(
    screen.getByLabelText('Email address'),
    'test@email.address.pl'
  );
  await userEvent.type(screen.getByLabelText('Password'), 'test-password');
  await userEvent.type(
    screen.getByLabelText('Repeat Password'),
    'test-password'
  );
  await userEvent.keyboard('{Enter}');

  await screen.findByRole('success');

  // Check that the mutation was called with the expected structure
  expect(mockMutate).toHaveBeenCalledWith({
    body: expect.objectContaining({
      login: 'test-login',
      email: 'test@email.address.pl',
      password: 'test-password',
      repeatedPassword: 'test-password',
      language: expect.stringMatching(/^(en|sl)$/),
      timezone: expect.any(String),
    }),
  });

  expect(onSuccess).toHaveBeenCalledWith({
    apiKey: 'test-api-key',
  });
});

test('<Register /> should handle failed registration attempt', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();

  (usePostUserRegister as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: false,
    isError: true,
    error: 'Test error',
  });

  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <UserContext.Provider
        value={{ state: { ...initialUserState }, dispatch }}
      >
        <Register />
      </UserContext.Provider>
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText('Login'), 'test-login');
  await userEvent.type(
    screen.getByLabelText('Email address'),
    'test@email.address.pl'
  );
  await userEvent.type(screen.getByLabelText('Password'), 'test-password');
  await userEvent.type(
    screen.getByLabelText('Repeat Password'),
    'test-password'
  );
  await userEvent.click(screen.getByText('Create Account'));

  // Check that the mutation was called with the expected structure
  expect(mockMutate).toHaveBeenCalledWith({
    body: expect.objectContaining({
      login: 'test-login',
      email: 'test@email.address.pl',
      password: 'test-password',
      repeatedPassword: 'test-password',
      language: expect.stringMatching(/^(en|sl)$/),
      timezone: expect.any(String),
    }),
  });

  await screen.findByRole('error');
});
