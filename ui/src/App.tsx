import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Main } from 'main/Main/Main';
import { UserContextProvider } from 'contexts';
import { LanguageProvider } from 'contexts';
import './i18n'; // Initialize i18n

const queryClient = new QueryClient();

export const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <UserContextProvider>
          <Main />
        </UserContextProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
