import { useLocation, Outlet, Navigate } from 'react-router';
import { useAuth } from 'hooks/auth';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute - showing loading state');
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected route
  // Note: user might be null while user data is loading, but that's OK
  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};
