import * as Yup from 'yup';

// Custom validation function that integrates with react-i18next
const createValidationSchema = (t: (key: string) => string) => Yup.object({
  login: Yup.string()
    .min(3, t('auth:register.errors.loginTooShort'))
    .required(t('validation:required')),
  email: Yup.string()
    .email(t('auth:register.errors.invalidEmail'))
    .required(t('validation:required')),
  password: Yup.string()
    .min(5, t('auth:register.errors.passwordTooShort'))
    .required(t('validation:required')),
  repeatedPassword: Yup.string()
    .oneOf([Yup.ref('password')], t('auth:register.errors.passwordsDoNotMatch'))
    .required(t('validation:required')),
  language: Yup.string()
    .oneOf(['en', 'sl'], t('validation:invalidLanguage'))
    .required(t('validation:required')),
  timezone: Yup.string()
    .required(t('validation:required')),
});

export { createValidationSchema };
