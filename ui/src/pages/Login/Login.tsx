import { Link, useNavigate, useLocation } from 'react-router';
import Form from 'react-bootstrap/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { TwoColumnHero, FormikInput, FeedbackButton } from 'components';
import { createValidationSchema } from './Login.validations';
import { useApiKeyState, useAuth } from 'hooks/auth';
import { usePostUserLogin } from 'api/apiComponents';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type LoginParams = Yup.InferType<ReturnType<typeof createValidationSchema>>;

export const Login = () => {
  const [, setApiKeyState] = useApiKeyState();
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();

  // useAuth now handles both authentication and user data fetching
  const { user, isAuthenticated } = useAuth();

  // Get the intended destination from location state, or default to /main
  const from = (location.state as { from?: Location })?.from?.pathname || '/main';

  // Create validation schema with translations
  const validationSchema = createValidationSchema(t);

  const mutation = usePostUserLogin({
    onSuccess: ({ apiKey }) => {
      setApiKeyState({ apiKey });
      // useAuth will automatically fetch user data and update context
      // The redirect will happen automatically once the user context is updated
    },
  });

  // Redirect to the intended destination once user data is loaded
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, navigate, from]);

  return (
    <TwoColumnHero>
      <h3 className="mb-4">{t('login.title')}</h3>
      <Formik<LoginParams>
        initialValues={{ loginOrEmail: '', password: '' }}
        onSubmit={(values) => mutation.mutateAsync({ body: values })}
        validationSchema={validationSchema}
      >
        <Form className="w-75" as={FormikForm}>
          <FormikInput name="loginOrEmail" label={t('login.loginOrEmail')} />
          <FormikInput name="password" type="password" label={t('login.password')} />
          <div className="d-flex justify-content-between align-items-center">
            <Link className="text-muted" to="/recover-lost-password">
              {t('login.forgotPassword')}
            </Link>
            <FeedbackButton
              className="float-end"
              type="submit"
              label={t('login.loginButton')}
              variant="primary"
              Icon={BiLogInCircle}
              mutation={mutation}
            />
          </div>
        </Form>
      </Formik>
    </TwoColumnHero>
  );
};
