import * as Yup from 'yup';

// Custom validation function that integrates with react-i18next
const createValidationSchema = (t: (key: string) => string) => Yup.object({
  loginOrEmail: Yup.string().required(t('auth:login.errors.loginRequired')),
  password: Yup.string().required(t('auth:login.errors.passwordRequired')),
});

export { createValidationSchema };
