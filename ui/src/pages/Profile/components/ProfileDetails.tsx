import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BiArrowFromBottom } from 'react-icons/bi';
import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { FormikInput, FeedbackButton } from 'components';
import { usePostUser } from 'api/apiComponents';
import { validationSchema } from './ProfileDetails.validations';
import { useUserContext } from 'contexts/UserContext/User.context';
import { mapBackendUserToFrontend } from 'contexts/UserContext/UserContext';
import { useTranslation } from 'react-i18next';
import { PreferencesSection } from './PreferencesSection';
import { detectBrowserTimezone } from '../../../utils/preferences';

export type ProfileDetailsParams = Yup.InferType<typeof validationSchema>;

export const ProfileDetails = () => {
  const {
    dispatch,
    state: { user },
  } = useUserContext();
  const { t } = useTranslation(['common', 'auth']);

  const mutation = usePostUser();
  const { data, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess) {
      // Map the backend response to frontend format
      const mappedUser = mapBackendUserToFrontend(data);
      dispatch({ type: 'UPDATE_USER_DATA', user: mappedUser });
    }
  }, [isSuccess, dispatch, data]);

  return (
    <Container className="py-5">
      <Row>
        <Col md={9} lg={7} xl={6} className="mx-auto">
          {user ? (
            <>
              <h3 className="mb-4">{t('profile.title')}</h3>
              <Formik<ProfileDetailsParams>
                initialValues={{
                  login: user.login || '',
                  email: user.email || '',
                  language: (user.language as 'en' | 'sl') || 'en',
                  timezone: user.timezone || detectBrowserTimezone(),
                  unitSystem: (user.unitSystem as 'metric' | 'imperial') || 'metric',
                }}
                onSubmit={(values) => mutation.mutate({ body: values })}
                validationSchema={validationSchema}
              >
                <Form as={FormikForm}>
                  <h4 className="mb-3">{t('profile.personalInfo', { defaultValue: 'Personal Information' })}</h4>
                  <FormikInput name="login" label={t('register.login', { ns: 'auth' })} />
                  <FormikInput name="email" label={t('register.email', { ns: 'auth' })} />

                  <PreferencesSection
                    onLanguageChange={() => {
                      // This will be handled by Formik when the form is submitted
                    }}
                  />

                  <FeedbackButton
                    className="float-end"
                    type="submit"
                    label={t('profile.updateButton')}
                    variant="secondary"
                    Icon={BiArrowFromBottom}
                    mutation={mutation}
                    successLabel={t('profile.updateSuccess')}
                  />
                </Form>
              </Formik>
            </>
          ) : (
            <h3 className="mb-4">{t('profile.notAvailable')}</h3>
          )}
        </Col>
      </Row>
    </Container>
  );
};
