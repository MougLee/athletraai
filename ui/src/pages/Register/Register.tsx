import Form from 'react-bootstrap/Form';
import { BiUserPlus } from 'react-icons/bi';
import { Formik, Form as FormikForm } from 'formik';
import { TwoColumnHero, FormikInput, FeedbackButton } from 'components';
import { usePostUserRegister } from 'api/apiComponents';
import { validationSchema } from './Register.validations';
import { initialValues, RegisterParams } from './Register.utils';
import { useApiKeyState } from 'hooks/auth';
import { useTranslation } from 'react-i18next';

export const Register = () => {
  const [, setApiKeyState] = useApiKeyState();
  const { t } = useTranslation('auth');

  const mutation = usePostUserRegister({
    onSuccess: ({ apiKey }) => {
      setApiKeyState({ apiKey });
    },
  });

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
