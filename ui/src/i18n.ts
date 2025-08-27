import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enValidation from './locales/en/validation.json';
import enOnboarding from './locales/en/onboarding.json';

import slCommon from './locales/sl/common.json';
import slAuth from './locales/sl/auth.json';
import slValidation from './locales/sl/validation.json';
import slOnboarding from './locales/sl/onboarding.json';

const resources = {
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
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'sessionStorage'],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
    },

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Namespace options
    ns: ['common', 'auth', 'validation', 'onboarding'],
    defaultNS: 'common',

    // Pluralization rules
    pluralSeparator: '_',
    contextSeparator: '_',

    // React specific options
    react: {
      useSuspense: false, // Disable Suspense for better compatibility
    },
  });

export default i18n;
