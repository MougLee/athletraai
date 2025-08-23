import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderWithClient } from 'tests';
import { RecoverLostPassword } from './RecoverLostPassword';
import { usePostPasswordresetForgot } from 'api/apiComponents';

const mockMutate = vi.fn();

vi.mock('api/apiComponents', () => ({
  usePostPasswordresetForgot: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('renders header', () => {
  (usePostPasswordresetForgot as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    isPending: false,
    isIdle: false,
    error: '',
  });

  renderWithClient(<RecoverLostPassword />);

  expect(screen.getByText('Recover lost password')).toBeInTheDocument();
});

test('handles password recover success', async () => {
  (usePostPasswordresetForgot as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    isPending: false,
    isIdle: false,
    error: '',
  });

  renderWithClient(<RecoverLostPassword />);

  await userEvent.type(screen.getByLabelText('Login or Email'), 'test-login');
  await userEvent.click(screen.getByText('Reset password'));

  expect(mockMutate).toHaveBeenCalledWith({
    body: { loginOrEmail: 'test-login' },
  });

  await screen.findByRole('success');
  await screen.findByText('Password reset claim success');
});

test('handles password recover error', async () => {
  (usePostPasswordresetForgot as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: false,
    isError: true,
    isPending: false,
    isIdle: false,
    error: 'Test error',
  });

  renderWithClient(<RecoverLostPassword />);

  await userEvent.type(screen.getByLabelText('Login or Email'), 'test-login');
  await userEvent.click(screen.getByText('Reset password'));

  expect(mockMutate).toHaveBeenCalledWith({
    body: { loginOrEmail: 'test-login' },
  });

  await screen.findByRole('error');
});
