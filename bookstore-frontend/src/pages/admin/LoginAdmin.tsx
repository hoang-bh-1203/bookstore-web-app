// pages/admin/LoginAdmin.tsx

import AdminLoginForm from '@/components/forms/admin-login-form';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'ROLE_ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  );
};

export default LoginAdmin;
