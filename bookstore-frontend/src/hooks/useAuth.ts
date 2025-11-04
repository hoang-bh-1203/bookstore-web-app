import { useEffect } from 'react';
import { useNavigate, useNavigation } from 'react-router';
import {
  useAuthStore,
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectError,
  selectIsLoading,
} from '@/stores/useAuthStore';

/**
 * Custom hook for authentication management
 * Provides auth state and actions for login, logout, and auth checking
 */
export const useAuth = () => {
  // Get state from store using selectors
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const error = useAuthStore(selectError);
  const isLoading = useAuthStore(selectIsLoading);

  // Get actions from store
  const loginAction = useAuthStore((state) => state.login);
  const logoutAction = useAuthStore((state) => state.logout);
  const checkAuthAction = useAuthStore((state) => state.checkAuth);
  const clearErrorAction = useAuthStore((state) => state.clearError);

  const navigate = useNavigate();
  const path = useNavigation();

  // Automatically check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Token is managed by persist middleware
    if (!token && path.location?.pathname.includes('admin')) {
      navigate('/admin/login');
    }

    if (!user) {
      checkAuthAction(); // Call action directly to verify authentication
    }
  }, [checkAuthAction, user, navigate, path.location?.pathname]);

  const handleLogin = async (email: string, password: string) => {
    await loginAction({ email, password });
    // After await, we can check the error state in the store
    // getState() retrieves the latest state outside of component render
    const loginError = useAuthStore.getState().error;
    return !loginError; // Returns true if no error (success)
  };

  const handleLogout = () => {
    logoutAction(); // Call logout action directly
  };

  const clearAuthError = () => {
    clearErrorAction(); // Call clear error action directly
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    error,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};
