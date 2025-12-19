import { useCallback, useState } from 'react';
import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (
      email: string,
      password: string,
      confirmPassword: string,
    ): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const response = await Request.post<{ message: string }>(
          API_ENDPOINTS.REGISTER,
          { email, password, confirmPassword },
        );
        return response.message || 'Đăng ký thành công';
      } catch (err: any) {
        const errorMessage = err?.message || 'Có lỗi xảy ra khi đăng ký';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    register,
    loading,
    error,
    setError,
  };
};
