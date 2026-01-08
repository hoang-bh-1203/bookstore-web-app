import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner'; // Hoặc thư viện toast bạn đang dùng

const OAuth2Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các action từ store thông qua getState để đảm bảo lấy hàm mới nhất mà không cần hook selector
  const { checkAuth } = useAuthStore.getState();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const role = searchParams.get('role');

    if (accessToken && refreshToken) {
      // 1. Lưu token vào Store (Zustand sẽ tự persist vào localStorage nhờ middleware)
      useAuthStore.setState({
        accessToken,
        refreshToken,
        isLoading: true, // Set loading để UI chờ checkAuth
      });

      // 2. Gọi API /me để lấy full thông tin User (Avatar, FullName...)
      checkAuth()
        .then(() => {
          // 3. Điều hướng dựa trên Role (giống logic onSubmit của bạn)
          toast.success('Đăng nhập Google thành công');

          if (role === 'ROLE_ADMIN') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        })
        .catch(() => {
          toast.error('Lỗi xác thực người dùng');
          navigate('/', { replace: true });
        });
    } else {
      // Trường hợp không có token trên URL
      toast.error('Đăng nhập thất bại');
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate, checkAuth]);

  // Màn hình loading trong lúc xử lý token
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span className="ml-3">Đang xử lý đăng nhập...</span>
    </div>
  );
};

export default OAuth2Callback;
