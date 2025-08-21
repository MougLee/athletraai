import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';

export const NotFound: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Container className="py-5 text-center">
      <h1>{t('notFound.oops')}</h1>
      <h3>{t('notFound.message')}</h3>
      <div>{t('notFound.chooseLocation')}</div>
      <ul className="list-group">
        <li>
          <Link to="/">{t('notFound.homePage')}</Link>
        </li>
        <li>
          <a href="https://building.athletraai.com">
            {t('notFound.buildingAthletra')}
          </a>
        </li>
      </ul>
    </Container>
  );
};
