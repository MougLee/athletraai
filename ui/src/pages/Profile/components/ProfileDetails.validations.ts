import * as Yup from 'yup';

// Custom validation function that integrates with react-i18next
const createValidationSchema = (t: (key: string) => string) => Yup.object({
  login: Yup.string()
    .min(3, t('validation:minLength'))
    .required(t('validation:required')),
  email: Yup.string()
    .email(t('validation:invalidEmail'))
    .required(t('validation:required')),
  language: Yup.string()
    .oneOf(['en', 'sl'], t('validation:invalidLanguage'))
    .required(t('validation:required')),
  timezone: Yup.string()
    .required(t('validation:required')),
  unitSystem: Yup.string()
    .oneOf(['metric', 'imperial'], t('validation:invalidUnitSystem'))
    .required(t('validation:required')),
});

export { createValidationSchema };
