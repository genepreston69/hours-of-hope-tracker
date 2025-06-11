
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // For routes that require authentication
  if (requireAuth) {
    if (!user) {
      // Redirect to login but save the location they were trying to access
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }
  
  // For routes that should redirect to dashboard when logged in (like /auth)
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export { ProtectedRoute };
export default ProtectedRoute;
