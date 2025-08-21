import * as Yup from 'yup';

export const validationSchema = Yup.object({
  loginOrEmail: Yup.string().required('auth:login.errors.loginRequired'),
  password: Yup.string().required('auth:login.errors.passwordRequired'),
});
