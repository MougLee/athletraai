import * as Yup from 'yup';
import { validationSchema } from './Register.validations';

// Detect browser language and timezone
const detectBrowserLanguage = (): 'en' | 'sl' => {
  const browserLang = navigator.language.toLowerCase();
  // Check for Slovene language codes (sl, sl-SI, etc.)
  if (browserLang.startsWith('sl')) {
    return 'sl';
  }
  // Default to English for all other languages
  return 'en';
};

const detectBrowserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
};

export const initialValues = {
  login: '',
  email: '',
  password: '',
  repeatedPassword: '',
  language: detectBrowserLanguage(),
  timezone: detectBrowserTimezone(),
};

export type RegisterParams = Yup.InferType<typeof validationSchema>;
