import Form from 'react-bootstrap/Form';
import { BiUserPlus } from 'react-icons/bi';
import { Formik, Form as FormikForm } from 'formik';
import { useNavigate, useLocation } from 'react-router';
import { TwoColumnHero, FormikInput, FeedbackButton } from 'components';
import { usePostUserRegister } from 'api/apiComponents';
import { validationSchema } from './Register.validations';
import { initialValues, RegisterParams } from './Register.utils';
import { useApiKeyState, useAuth } from 'hooks/auth';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const Register = () => {
  const [, setApiKeyState] = useApiKeyState();
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();

  // useAuth now handles both authentication and user data fetching
  const { user, isAuthenticated } = useAuth();

  // Get the intended destination from location state, or default to /main
  const from = (location.state as { from?: Location })?.from?.pathname || '/main';

  const mutation = usePostUserRegister({
    onSuccess: ({ apiKey }) => {
      setApiKeyState({ apiKey });
      // useAuth will automatically fetch user data and update context
      // The redirect will happen automatically once the user context is updated
    },
    onError: (error: any) => {
      console.log('Registration error:', error);
      console.log('Error structure:', {
        error,
        message: error?.message,
        response: error?.response,
        'response.data': error?.response?.data,
        'response.data.error': error?.response?.data?.error,
      });
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
      <h3 className="mb-4">{t('register.title')}</h3>
      <Formik<RegisterParams>
        initialValues={initialValues}
        onSubmit={(values) => mutation.mutate({ body: values })}
        validationSchema={validationSchema}
      >
        <Form className="w-75" as={FormikForm}>
          <FormikInput name="login" label={t('register.login')} />
          <FormikInput name="email" label={t('register.email')} />
          <FormikInput name="password" label={t('register.password')} type="password" />
          <FormikInput
            name="repeatedPassword"
            label={t('register.repeatPassword')}
            type="password"
          />

          <FeedbackButton
            className="float-end"
            type="submit"
            label={t('register.registerButton')}
            variant="primary"
            Icon={BiUserPlus}
            mutation={mutation}
          />
        </Form>
      </Formik>
    </TwoColumnHero>
  );
};
