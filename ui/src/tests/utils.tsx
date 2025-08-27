import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LanguageProvider } from '../contexts/LanguageContext/LanguageContext';
import { UserContextProvider } from '../contexts/UserContext/UserContext';

// Import translation files
import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enValidation from '../locales/en/validation.json';
import enOnboarding from '../locales/en/onboarding.json';

import slCommon from '../locales/sl/common.json';
import slAuth from '../locales/sl/auth.json';
import slValidation from '../locales/sl/validation.json';
import slOnboarding from '../locales/sl/onboarding.json';

// Create test-specific i18n instance
const testI18n = i18next.createInstance();

testI18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        auth: enAuth,
        validation: enValidation,
        onboarding: enOnboarding,
      },
      sl: {
        common: slCommon,
        auth: slAuth,
        validation: slValidation,
        onboarding: slOnboarding,
      },
    },
    lng: 'en', // Force English for tests
    fallbackLng: 'en',
    debug: false, // Disable debug for tests
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'auth', 'validation', 'onboarding'],
    defaultNS: 'common',
    react: {
      useSuspense: false,
    },
  });

// Create a test-specific QueryClient with better defaults for testing
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Don't retry failed queries in tests
      gcTime: 0, // Don't cache queries in tests
    },
    mutations: {
      retry: false, // Don't retry failed mutations in tests
    },
  },
});

const defaultQueryClient = createTestQueryClient();

export const renderWithClient = (
  ui: ReactElement,
  client: QueryClient = defaultQueryClient
) => render(
  <LanguageProvider>
    <I18nextProvider i18n={testI18n}>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </I18nextProvider>
  </LanguageProvider>
);

export const renderWithProviders = (
  ui: ReactElement,
  client: QueryClient = defaultQueryClient
) => render(
  <LanguageProvider>
    <I18nextProvider i18n={testI18n}>
      <QueryClientProvider client={client}>
        <UserContextProvider>
          {ui}
        </UserContextProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </LanguageProvider>
);
