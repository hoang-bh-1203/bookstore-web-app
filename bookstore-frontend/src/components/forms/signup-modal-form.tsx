import React, { useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useLoading } from '@/hooks/useLoading';
import signupPicture from '@/assets/login-picture.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRegister } from '@/hooks/useRegister.ts';

export function SignupModal() {
  const { isSignupModalOpen, closeSignupModal, openLoginModal } = useModal();
  const { showLoading, hideLoading } = useLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, error: userError, setError: setUserError } = useRegister();

  React.useEffect(() => {
    if (userError) {
      toast.error('Đăng ký thất bại', { description: userError });
      setUserError('');
    }
  }, [userError, setUserError]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');

    if (password !== confirmPassword) {
      toast.error('Mật khẩu không khớp!');
      return;
    }

    try {
      setSubmitting(true);
      showLoading('Đang tạo tài khoản...');
      const success = await register(email, password, confirmPassword);

      if (success) {
        toast.success('Đăng ký thành công!');
        closeSignupModal();
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage =
        typeof err === 'string'
          ? err
          : err?.message || 'Đã xảy ra lỗi không xác định.';
      setUserError(errorMessage);
    } finally {
      hideLoading();
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isSignupModalOpen} onOpenChange={closeSignupModal}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-3xl">
        <div className="relative rounded-lg bg-[#F8F8F8]">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSignupModal}
            className="absolute -right-5 -top-5 z-50 w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex min-h-[440px]">
            {/* Left Side - Form */}
            <div className="relative w-[500px] bg-white rounded-l-lg p-11 flex flex-col">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  closeSignupModal();
                  openLoginModal();
                }}
                className="absolute left-6 top-6 text-muted-foreground hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <h4 className="font-medium text-2xl text-foreground mt-12">
                Tạo tài khoản mới
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Nhập thông tin để tạo tài khoản Tiki
              </p>

              <form onSubmit={handleRegister} className="mt-8 flex-1">
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
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Xác nhận mật khẩu"
                      className="h-11 pr-12"
                      disabled={submitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-medium"
                    >
                      {showConfirmPassword ? (
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
                  Tạo tài khoản
                </Button>
              </form>

              <div className="text-sm mt-auto text-muted-foreground">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    closeSignupModal();
                    openLoginModal();
                  }}
                  className="text-primary font-medium ml-1 hover:underline"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
            {/* Right Side */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#DEEBFF] rounded-r-lg p-6">
              <img
                src={signupPicture}
                alt="Signup Robot"
                className="w-40 h-40 object-contain mb-6"
              />
              <h4 className="text-primary font-medium text-lg text-center">
                Chào mừng đến Tiki
              </h4>
              <p className="text-primary/80 text-sm text-center mt-1">
                Khám phá thế giới mua sắm
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
