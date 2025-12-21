import React, { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useLoading } from '@/hooks/useLoading';
import { useAuth } from '@/hooks/useAuth';
import loginPicture from '@/assets/login-picture.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, openSignupModal } = useModal();
  const { showLoading, hideLoading } = useLoading();
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error('Đăng nhập thất bại', { description: error });
    }
  }, [error]);

  // Reset form fields when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setEmail('');
      setPassword('');
      clearError();
    }
  }, [isLoginModalOpen, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      setSubmitting(true);
      showLoading('Đang đăng nhập...');
      const success = await login(email, password);
      if (success) {
        toast.success('Đăng nhập thành công!');
        closeLoginModal();
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-3xl">
        <div className="relative rounded-lg bg-[#F8F8F8]">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeLoginModal}
            className="absolute -right-5 -top-5 z-50 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex min-h-[440px]">
            {/* Left Side - Form */}
            <div className="relative w-[500px] bg-white rounded-l-lg p-11 flex flex-col">
              <h4 className="font-medium text-2xl text-foreground">
                Đăng nhập bằng email
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Nhập email và mật khẩu tài khoản
              </p>

              <form onSubmit={handleSubmit} className="mt-8 flex-1">
                <div className="space-y-6">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="acb@email.com"
                    className="h-11"
                    disabled={submitting}
                    required
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu"
                      className="h-11 pr-12"
                      disabled={submitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-medium"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full text-lg h-12"
                  disabled={submitting}
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Đăng nhập
                </Button>
              </form>

              <div className="text-sm mt-auto">
                <p className="text-primary cursor-pointer hover:underline">
                  Quên mật khẩu?
                </p>
                <p className="mt-2 text-muted-foreground">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      closeLoginModal();
                      openSignupModal();
                    }}
                    className="text-primary font-medium ml-1 hover:underline"
                  >
                    Tạo tài khoản
                  </button>
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#DEEBFF] rounded-r-lg p-6">
              <img
                src={loginPicture}
                alt="Login Robot"
                className="w-40 h-40 object-contain mb-6"
              />
              <h4 className="text-primary font-medium text-lg text-center">
                Mua sắm tại BS
              </h4>
              <p className="text-primary/80 text-sm text-center mt-1">
                Siêu ưu đãi mỗi ngày
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
