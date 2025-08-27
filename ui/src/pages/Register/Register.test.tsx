import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { renderWithClient } from 'tests';
import { Register } from './Register';
import { UserContext } from 'contexts/UserContext/UserContext';
import { initialUserState } from 'contexts/UserContext/UserContext.constants';
import { usePostUserRegister, useGetUser } from 'api/apiComponents';
import { LanguageProvider } from 'contexts/LanguageContext';

vi.mock('api/apiComponents', () => ({
  usePostUserRegister: vi.fn(),
  useGetUser: vi.fn(),
}));

// Mock the validation schema creation
vi.mock('./Register.validations', () => ({
  createValidationSchema: vi.fn(() => ({
    validate: vi.fn().mockResolvedValue(true),
  })),
}));

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

// Helper function to create a complete mutation mock
const createMutationMock = (overrides: any = {}) => ({
  mutate: vi.fn(),
  reset: vi.fn(),
  data: undefined,
  isSuccess: false,
  isError: false,
  isPending: false,
  isIdle: true,
  error: null,
  ...overrides,
});

// Helper function to create a complete query mock
const createQueryMock = (overrides: any = {}) => ({
  data: undefined,
  isSuccess: false,
  isError: false,
  isLoading: false,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  
  // Set up default mocks
  (useGetUser as any).mockReturnValue(createQueryMock());
});

test('<Register /> should render the header text', () => {
  const mockMutate = vi.fn();
  
  (usePostUserRegister as any).mockReturnValue(
    createMutationMock({
      mutate: mockMutate,
      isSuccess: true,
      data: { apiKey: 'test-api-key' },
      isIdle: false,
    })
  );

  renderWithClient(createTestWrapper(<Register />));

  expect(screen.getByText('Register')).toBeInTheDocument();
});

test('<Register /> should handle successful registration through the submit button click', async () => {
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();

  (usePostUserRegister as any).mockReturnValue(
    createMutationMock({
      mutate: mockMutate.mockImplementation(async () => {
        onSuccess({ apiKey: 'test-api-key' });
      }),
      data: { apiKey: 'test-api-key' },
      isSuccess: true,
      isIdle: false,
    })
  );

  renderWithClient(createTestWrapper(<Register />));

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
  const mockMutate = vi.fn();
  const onSuccess = vi.fn();

  (usePostUserRegister as any).mockReturnValue(
    createMutationMock({
      mutate: mockMutate.mockImplementation(async () => {
        onSuccess({ apiKey: 'test-api-key' });
      }),
      data: { apiKey: 'test-api-key' },
      isSuccess: true,
      isIdle: false,
    })
  );

  renderWithClient(createTestWrapper(<Register />));

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
  const mockMutate = vi.fn();

  (usePostUserRegister as any).mockReturnValue(
    createMutationMock({
      mutate: mockMutate,
      data: { apiKey: 'test-api-key' },
      isSuccess: false,
      isError: true,
      error: 'Test error',
      isIdle: false,
    })
  );

  renderWithClient(createTestWrapper(<Register />));

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
