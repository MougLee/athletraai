import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { UserContext } from 'contexts/UserContext/UserContext';
import { UserState } from 'contexts';
import { renderWithClient } from 'tests';
import { ProfileDetails } from './ProfileDetails';
import { usePostUser } from 'api/apiComponents';

const loggedUserState: UserState = {
  user: {
    login: 'user-login',
    email: 'email@address.pl',
    createdOn: '2020-10-09T09:57:17.995288Z',
    language: 'en',
    timezone: 'UTC',
    unitSystem: 'metric',
  },
};
vi.mock('api/apiComponents', () => ({
  usePostUser: vi.fn(),
}));

beforeEach(() => {
  vi.restoreAllMocks();
});




test('<ProfileDetails /> should render current user data', () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();

  (usePostUser as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    error: '',
  });

  renderWithClient(
    <UserContext.Provider value={{ state: loggedUserState, dispatch }}>
      <ProfileDetails />
    </UserContext.Provider>
  );

  expect((screen.getByLabelText('Login') as HTMLInputElement).value).toEqual(
    'user-login'
  );
  expect(
    (screen.getByLabelText('Email address') as HTMLInputElement).value
  ).toEqual('email@address.pl');
});

test('<ProfileDetails /> should not render any existing user data', () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();

  (usePostUser as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: { apiKey: 'test-api-key' },
    isSuccess: true,
    isError: false,
    error: '',
  });

  renderWithClient(
    <UserContext.Provider value={{ state: { user: null }, dispatch }}>
      <ProfileDetails />
    </UserContext.Provider>
  );

  expect(screen.getByText('Profile details not available.')).toBeVisible();
});

test('<ProfileDetails /> should handle details update successfully', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();

  (usePostUser as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: {
      login: 'test-login',
      email: 'test@email.address',
      language: 'en',
      timezone: 'UTC',
      unitSystem: 'metric',
      createdOn: '2020-10-09T09:57:17.995288Z'
    },
    isSuccess: true,
    isError: false,
    error: '',
  });

  renderWithClient(
    <UserContext.Provider value={{ state: loggedUserState, dispatch }}>
      <ProfileDetails />
    </UserContext.Provider>
  );

  await userEvent.clear(screen.getByLabelText('Login'));
  await userEvent.type(screen.getByLabelText('Login'), 'test-login');
  await userEvent.clear(screen.getByLabelText('Email address'));
  await userEvent.type(
    screen.getByLabelText('Email address'),
    'test@email.address'
  );
  await userEvent.click(screen.getByText('Update profile data'));

  expect(mockMutate).toHaveBeenCalledWith({
    body: {
      email: 'test@email.address',
      login: 'test-login',
      language: 'en',
      timezone: 'UTC',
      unitSystem: 'metric'
    },
  });

  expect(dispatch).toHaveBeenCalledWith({
    type: 'UPDATE_USER_DATA',
    user: {
      login: 'test-login',
      email: 'test@email.address',
      language: 'en',
      timezone: 'UTC',
      unitSystem: 'metric',
      createdOn: '2020-10-09T09:57:17.995288Z'
    },
  });

  await screen.findByRole('success');
  await screen.findByText('Profile details changed');
});

test('<ProfileDetails /> should handle details update error', async () => {
  const dispatch = vi.fn();
  const mockMutate = vi.fn();

  (usePostUser as any).mockReturnValue({
    mutate: mockMutate,
    reset: vi.fn(),
    data: {
      login: 'test-login',
      email: 'test@email.address',
      language: 'en',
      timezone: 'UTC',
      unitSystem: 'metric',
      createdOn: '2020-10-09T09:57:17.995288Z'
    },
    isSuccess: true,
    isError: true,
    error: 'Test error',
  });

  renderWithClient(
    <UserContext.Provider value={{ state: loggedUserState, dispatch }}>
      <ProfileDetails />
    </UserContext.Provider>
  );

  await userEvent.clear(screen.getByLabelText('Login'));
  await userEvent.type(screen.getByLabelText('Login'), 'test-login');
  await userEvent.clear(screen.getByLabelText('Email address'));
  await userEvent.type(
    screen.getByLabelText('Email address'),
    'test@email.address'
  );
  await userEvent.click(screen.getByText('Update profile data'));

  expect(mockMutate).toHaveBeenCalledWith({
    body: {
      email: 'test@email.address',
      login: 'test-login',
      language: 'en',
      timezone: 'UTC',
      unitSystem: 'metric'
    },
  });
  expect(dispatch).toHaveBeenCalledWith({
    type: 'UPDATE_USER_DATA',
    user: {
      login: 'test-login',
      email: 'test@email.address',
      language: 'en',
      timezone: 'UTC',
      unitSystem: 'metric',
      createdOn: '2020-10-09T09:57:17.995288Z'
    },
  });
  expect(await screen.findByRole('error')).toBeInTheDocument();
});
