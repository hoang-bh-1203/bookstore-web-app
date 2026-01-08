import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, forgotPassword, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      const success = await forgotPassword(email);
      if (success) {
        alert(`Link khôi phục mật khẩu đã được gửi đến ${email}`);
        setIsForgotPassword(false);
        setEmail('');
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setEmail('');
    clearError();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    try {
      const success = await login(email, password);
      if (success) {
        // Close modal and reset form on successful login
        onOpenChange(false);
        setEmail('');
        setPassword('');

        // Check user role and redirect accordingly
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await register(email, name, password);
      if (success) {
        // Check if user is now authenticated (auto-login)
        const isNowAuthenticated = useAuthStore.getState().accessToken !== null;

        if (isNowAuthenticated) {
          // Auto-logged in, close modal and navigate
          onOpenChange(false);
          setEmail('');
          setPassword('');
          setName('');
          setConfirmPassword('');
          navigate('/');
        } else {
          // Registration successful but need to login
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          setName('');
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    clearError();
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleLoginWithGoogle = () => {
    const GOOGLE_AUTH_URL = 'http://localhost:8081/oauth2/authorization/google';

    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {isForgotPassword
              ? 'Quên mật khẩu'
              : isLogin
                ? 'Chào mừng trở lại'
                : 'Tạo tài khoản'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isForgotPassword
              ? 'Nhập email của bạn để nhận link khôi phục mật khẩu'
              : isLogin
                ? 'Đăng nhập để tiếp tục mua sắm'
                : 'Đăng ký để bắt đầu mua sắm'}
          </p>
        </DialogHeader>

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi link khôi phục'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToLogin}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Button>
          </form>
        ) : (
          <>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <form
              className="space-y-4 mt-4"
              onSubmit={isLogin ? handleLogin : handleRegister}
            >
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Đang xử lý...'
                  : isLogin
                    ? 'Đăng nhập'
                    : 'Đăng ký'}
              </Button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-background text-muted-foreground">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full bg-transparent"
                  onClick={handleLoginWithGoogle}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Tiếp tục với Google
                </Button>
              </div>

              {isLogin && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-secondary hover:text-secondary/80 hover:underline transition-colors cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                type="button"
                onClick={handleSwitchMode}
                className="text-secondary font-medium hover:underline cursor-pointer"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
