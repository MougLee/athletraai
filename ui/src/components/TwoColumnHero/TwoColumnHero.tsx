import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Fade from 'react-bootstrap/Fade';

interface TwoColumnHeroProps {
  children: React.ReactNode;
}

export const TwoColumnHero: React.FC<TwoColumnHeroProps> = ({ children }) => {
  return (
    <Container className="h-100">
      <Row className="h-100">
        <Col
          xs={12}
          xl={6}
          className="bg-brand-teal d-flex justify-content-center align-items-center"
        >
          <div className="brand-logo-container text-center text-white py-5">
            <svg className="brand-icon" viewBox="-10 0 210 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="10" width="120" height="120" rx="32" fill="var(--bs-primary)"></rect>
              <path d="M54 98L90 34L126 98" stroke="var(--color-white)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M66 78H114" stroke="var(--color-white)" strokeWidth="9" strokeLinecap="round"></path>
            </svg>
            <div className="brand-name">ATHLETRA AI</div>
          </div>
        </Col>
        <Col xs={12} xl={6}>
          <Fade className="h-100" appear in>
            <Container className="bg-white d-flex flex-column justify-content-center align-items-center px-5">
              {children}
            </Container>
          </Fade>
        </Col>
      </Row>
    </Container >
  );
};
