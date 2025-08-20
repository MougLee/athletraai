import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Fade from 'react-bootstrap/Fade';


export const Welcome: React.FC = () => (
  <>
    <Container fluid className="py-5 bg-light text-dark">
      <Row className="h-100">
        <Fade appear in>
          <Container className="d-flex flex-column justify-content-center align-items-center">
            <h3>Hi there!</h3>
            <h1>Welcome to Athletra AI!</h1>
            <p className="mt-3 px-4">
              To start training you can{' '}
              <Link to="/register" className="link-dark">
                Register
              </Link>{' '}
              as a new user,{' '}
              <Link to="/login" className="link-dark">
                Login
              </Link>{' '}
              .
            </p>
          </Container>
        </Fade>
      </Row>
    </Container>
  </>
);
