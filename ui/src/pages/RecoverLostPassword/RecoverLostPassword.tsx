import Form from 'react-bootstrap/Form';
import { BiReset } from 'react-icons/bi';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { TwoColumnHero, FormikInput, FeedbackButton } from 'components';
import { usePostPasswordresetForgot } from 'api/apiComponents';
import { validationSchema } from './RecoverLostPassword.validations';
import { useTranslation } from 'react-i18next';

export type RecoverLostPasswordParams = Yup.InferType<typeof validationSchema>;

export const RecoverLostPassword = () => {
  const mutation = usePostPasswordresetForgot();
  const { t } = useTranslation(['common', 'auth']);

  return (
    <TwoColumnHero>
      <h3 className="mb-4">{t('passwordReset.title')}</h3>
      <Formik<RecoverLostPasswordParams>
        initialValues={{
          loginOrEmail: '',
        }}
        onSubmit={(values) => mutation.mutate({ body: values })}
        validationSchema={validationSchema}
      >
        <Form className="w-75" as={FormikForm}>
          <FormikInput name="loginOrEmail" label={t('login.loginOrEmail', { ns: 'auth' })} />
          <FeedbackButton
            className="float-end"
            type="submit"
            label={t('passwordReset.resetButton')}
            variant="dark"
            Icon={BiReset}
            mutation={mutation}
            successLabel={t('passwordReset.resetSuccess')}
          />
        </Form>
      </Formik>
    </TwoColumnHero>
  );
};
