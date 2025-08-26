import * as Yup from 'yup';

// Custom validation function that integrates with react-i18next
const createValidationSchema = (t: (key: string) => string) => Yup.object({
  currentPassword: Yup.string()
    .min(3, t('validation:minLength'))
    .required(t('validation:required')),
  newPassword: Yup.string()
    .min(3, t('validation:minLength'))
    .required(t('validation:required')),
  repeatedPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], t('validation:passwordsDoNotMatch'))
    .required(t('validation:required')),
});

export { createValidationSchema };
