import * as Yup from 'yup';

export const validationSchema = Yup.object({
  login: Yup.string()
    .min(3, 'At least 3 characters required')
    .required('Required'),
  email: Yup.string()
    .email('Valid email address required')
    .required('Required'),
  language: Yup.string()
    .oneOf(['en', 'sl'], 'Invalid language selection')
    .required('Required'),
  timezone: Yup.string()
    .required('Required'),
  unitSystem: Yup.string()
    .oneOf(['metric', 'imperial'], 'Invalid units selection')
    .required('Required'),
});
