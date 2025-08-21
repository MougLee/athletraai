import { Mock } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithClient } from 'tests';
import { useGetAdminVersion } from 'api/apiComponents';
import { Footer } from './Footer';

vi.mock('api/apiComponents', () => ({
  useGetAdminVersion: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('renders version data', async () => {
  const mockedUseGetAdminVersion = useGetAdminVersion as Mock;

  mockedUseGetAdminVersion.mockReturnValue({
    isPending: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
    data: { buildDate: 'testDate', buildSha: 'testSha' },
  });

  renderWithClient(<Footer />);

  const info = screen.getByText(/Athletra AI/);

  expect(mockedUseGetAdminVersion).toHaveBeenCalled();
  expect(info).toBeInTheDocument();
});
