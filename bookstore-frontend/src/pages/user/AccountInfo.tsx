import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  User,
  Phone,
  Mail,
  Home,
  Lock,
  Smartphone,
  Trash2,
  Loader2,
} from 'lucide-react';
import ImageUpload from '@/components/common/image-uploader';
import facebook from '@/assets/facebook.svg';
import google from '@/assets/google.svg';

// Zod schema
const profileSchema = z.object({
  fullName: z.string().min(2, 'Tên quá ngắn!'),
  phone: z
    .string()
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ!'),
  email: z.string().email('Email không hợp lệ!'),
  address: z.string().optional(),
  avatarUrl: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AccountInfo = () => {
  const { user: userData } = useAuth(); // Get user from auth store
  const setUser = useAuthStore((state) => state.setUser);
  const { updateUser } = useUser();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      avatarUrl: [],
    },
  });

  useEffect(() => {
    if (userData) {
      console.log('AccountInfo user data:', {
        email: userData.email,
        role: userData.role,
        fullName: userData.fullName,
      });
      form.reset({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        avatarUrl: userData.avatarUrl ? [userData.avatarUrl] : [],
      });
    }
  }, [userData, form]); // Re-run when userData changes

  const onSubmit = async (values: ProfileFormValues) => {
    if (!userData?.id) {
      toast.error('Không tìm thấy thông tin người dùng!');
      return;
    }

    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        avatarUrl: values.avatarUrl?.[0] || null,
      };

      const response = await updateUser(userData.id, payload);
      if (response) {
        setUser(response);
        toast.success('Cập nhật thông tin thành công!');
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      toast.error('Cập nhật thất bại!');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Cập nhật thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel>Ảnh đại diện</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            maxCount={1}
                            toggleUploading={setIsUploadingAvatar}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Nhập họ và tên"
                                {...field}
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Nhập số điện thoại"
                                {...field}
                                className="pl-10"
                                maxLength={10}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Nhập email"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Nhập địa chỉ"
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isUploadingAvatar}
                    className="mt-4"
                  >
                    {isUploadingAvatar && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Lưu thay đổi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Right Column - Security & Social */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bảo mật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { icon: Lock, label: 'Thiết lập mật khẩu' },
                  { icon: Smartphone, label: 'Thiết lập mã PIN' },
                  { icon: Trash2, label: 'Yêu cầu xóa tài khoản' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="text-muted-foreground w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liên kết mạng xã hội</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center justify-between p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <img src={facebook} alt="Facebook" className="w-6 h-6" />
                    <span className="text-sm font-medium">Facebook</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-muted rounded-md cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <img src={google} alt="Google" className="w-6 h-6" />
                    <span className="text-sm font-medium">Google</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
