import { useAuth } from '@/hooks/useAuth';
import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface RequireRoleProps {
  children: JSX.Element;
  role: 'ROLE_ADMIN' | 'ROLE_USER';
}

const RequireRole = ({ children, role }: RequireRoleProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default RequireRole;
