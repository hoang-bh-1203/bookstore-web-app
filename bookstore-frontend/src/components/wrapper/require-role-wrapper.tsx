import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireRoleProps {
  children: JSX.Element;
  role: 'ROLE_ADMIN' | 'ROLE_USER';
}

const RequireRole = ({ children, role }: RequireRoleProps) => {
  const { user, refreshToken, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !refreshToken) {
    if (role === 'ROLE_ADMIN') {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default RequireRole;
