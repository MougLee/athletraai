import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { ProfileDetails } from './components/ProfileDetails';
import { PasswordDetails } from './components/PasswordDetails';
import { useAuth } from 'hooks/auth';

export const Profile: React.FC = () => {
  // useAuth now handles both authentication and user data fetching
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <Container className='bg-white p-5'>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Container className='bg-white p-5'>
        <div className="text-danger">Not authenticated or user data not available</div>
      </Container>
    );
  }

  return (
    <Container className='bg-white p-5'>
      <Row>
        <ProfileDetails />
        <PasswordDetails />
      </Row>
    </Container>
  );
};
