import { ReactNode, useReducer, createContext, useContext } from 'react';
import { produce } from 'immer';
import { initialUserState } from './UserContext.constants';

export interface UserDetails {
  createdOn: string;
  email: string;
  login: string;
  language?: string;
  timezone?: string;
  unitSystem?: string;
}

// Helper function to map backend field names to frontend field names
export const mapBackendUserToFrontend = (backendUser: any): UserDetails => ({
  createdOn: backendUser.createdOn,
  email: backendUser.email,
  login: backendUser.login,
  language: backendUser.language,
  timezone: backendUser.timezone,
  unitSystem: backendUser.unitSystem,
});

export interface UserState {
  user: UserDetails | null;
}

export type UserAction =
  | { type: 'UPDATE_USER_DATA'; user: Partial<UserDetails> }
  | { type: 'LOG_IN'; user: UserDetails }
  | { type: 'LOG_OUT' };

// Create the context
export const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialUserState,
  dispatch: () => {},
});

// Hook to use the context
export const useUserContext = () => useContext(UserContext);

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'UPDATE_USER_DATA':
      return produce(state, (draftState) => {
        if (!draftState.user) return;
        draftState.user = { ...draftState.user, ...action.user };
      });

    case 'LOG_IN':
      return produce(state, (draftState) => {
        draftState.user = action.user;
      });

    case 'LOG_OUT':
      return produce(state, (draftState) => {
        draftState.user = null;
      });

    default:
      return state;
  }
};

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
