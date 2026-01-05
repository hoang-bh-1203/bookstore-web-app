import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Custom hook for authentication management
 * Provides auth state and actions for login, logout, and auth checking
 */
export const useAuth = () => {
  // Use stable selectors - select primitive values and functions separately
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loginAction = useAuthStore((state) => state.login);
  const logoutAction = useAuthStore((state) => state.logout);
  const checkAuthAction = useAuthStore((state) => state.checkAuth);
  const clearErrorAction = useAuthStore((state) => state.clearError);
  const clearToken = useAuthStore((state) => state.clearToken);

  const navigate = useNavigate();

  // Compute derived values
  const isAuthenticated = !!accessToken;
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await loginAction({ email, password });
      // After await, we can check the error state in the store
      // getState() retrieves the latest state outside of component render
      const loginError = useAuthStore.getState().error;
      return !loginError; // Returns true if no error (success)
    },
    [loginAction],
  );

  const handleLogout = useCallback(() => {
    logoutAction(); // Call logout action directly
    navigate('/'); // Navigate to home after logout
  }, [logoutAction, navigate]);

  const clearAuthError = useCallback(() => {
    clearErrorAction(); // Call clear error action directly
  }, [clearErrorAction]);

  return {
    user,
    refreshToken,
    isAuthenticated,
    isAdmin,
    error,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    clearError: clearAuthError,
    checkAuth: checkAuthAction, // Expose for manual auth checking if needed
    clearToken,
  };
};
