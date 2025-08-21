import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Fade from 'react-bootstrap/Fade';
import { useTranslation } from 'react-i18next';

export const Welcome: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Container fluid className="py-5 bg-light text-dark">
        <Row className="h-100">
          <Fade appear in>
            <Container className="d-flex flex-column justify-content-center align-items-center">
              <h3>{t('welcome.greeting')}</h3>
              <h1>{t('welcome.title')}</h1>
              <p className="mt-3 px-4">
                {t('welcome.description')}{' '}
                <Link to="/register" className="link-dark">
                  {t('welcome.registerLink')}
                </Link>{' '}
                {t('welcome.asNewUser')}{' '}
                <Link to="/login" className="link-dark">
                  {t('welcome.loginLink')}
                </Link>{' '}
                {t('welcome.toContinue')}
              </p>
            </Container>
          </Fade>
        </Row>
      </Container>
    </>
  );
};
