import * as Yup from 'yup';

export const validationSchema = Yup.object({
  login: Yup.string()
    .min(3, 'auth:register.errors.loginTooShort')
    .required('validation:required'),
  email: Yup.string()
    .email('auth:register.errors.invalidEmail')
    .required('validation:required'),
  password: Yup.string()
    .min(5, 'auth:register.errors.passwordTooShort')
    .required('validation:required'),
  repeatedPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'auth:register.errors.passwordsDoNotMatch')
    .required('validation:required'),
  language: Yup.string()
    .oneOf(['en', 'sl'], 'validation:invalidLanguage')
    .required('validation:required'),
  timezone: Yup.string()
    .required('validation:required'),
});
