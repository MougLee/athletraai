import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router';
import { BiPowerOff, BiHappy } from 'react-icons/bi';
import { useUserContext } from 'contexts/UserContext/UserContext';
import { usePostUserLogout } from 'api/apiComponents';
import { useApiKeyState } from 'hooks/auth';
import { Button } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from 'components';

export const Top = () => {
  const {
    state: { user },
    dispatch,
  } = useUserContext();
  const [apiKeyState, setApiKeyState] = useApiKeyState();
  const apiKey = apiKeyState?.apiKey;
  const client = useQueryClient();
  const { t } = useTranslation('common');

  const { mutateAsync: logout } = usePostUserLogout({
    onSuccess: () => {
      setApiKeyState(null);
      client.clear();
      dispatch({ type: 'LOG_OUT' });
    },
  });

  return (
    <Navbar variant="light" className="bg-brand-teal" sticky="top" collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <svg className="brand-icon me-2" viewBox="-10 0 210 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="10" width="120" height="120" rx="32" fill="currentColor"/>
            <path d="M54 98L90 34L126 98" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M66 78H114" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round"/>
          </svg>
          <span className="brand-name">ATHLETRA AI</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex flex-grow-1 justify-content-between">
            <Nav.Link as={Link} to="/">
              {t('navigation.welcome')}
            </Nav.Link>
            <Nav.Link as={Link} to="/main">
              {t('navigation.home')}
            </Nav.Link>
            <div className="flex-grow-1" />
            <div className="d-flex align-items-center me-3">
              <LanguageSelector />
            </div>
            {user && apiKey ? (
              <>
                <Nav.Link as={Link} to="/onboarding" className="text-lg-end">
                  {t('navigation.onboarding')}
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="text-lg-end">
                  <BiHappy />
                  &nbsp;{user?.login}
                </Nav.Link>{' '}
                <Nav.Link
                  as={Button}
                  onClick={() => {
                    logout({
                      body: { apiKey },
                    });
                  }}
                >
                  <BiPowerOff />
                  &nbsp;{t('navigation.logout')}
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" className="text-lg-end">
                  {t('navigation.register')}
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="text-lg-end">
                  {t('navigation.login')}
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
