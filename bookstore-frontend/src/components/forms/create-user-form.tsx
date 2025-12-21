// components/forms/CreateUserForm.tsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, User, Phone, Mail, Lock, Users } from 'lucide-react';
import type { User as UserInterface } from '@/constants/interfaces';
import ImageUpload from '../common/image-uploader';

interface CreateUserFormProps {
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  defaultValues?: UserInterface;
  isUpdating?: boolean;
}

// 1. Define Zod schema
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự.')
    .max(50, 'Họ tên không được vượt quá 50 ký tự.'),
  phone: z
    .string()
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ.'),
  role: z.string({ required_error: 'Vui lòng chọn vai trò.' }),
  email: z.string().email('Email không hợp lệ.'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.')
    .max(20, 'Mật khẩu không được vượt quá 20 ký tự.')
    .optional(),
  avatarUrl: z.array(z.string()).optional().default([]),
});

// 2. Schema động: Yêu cầu mật khẩu khi tạo mới
const createUserSchema = (isUpdating: boolean) => {
  if (isUpdating) {
    return formSchema; // Mật khẩu là tùy chọn khi cập nhật
  }
  return formSchema.refine(
    (data) => data.password && data.password.length > 0,
    {
      message: 'Vui lòng nhập mật khẩu!',
      path: ['password'],
    },
  );
};

export default function CreateUserForm({
  onSubmit,
  onCancel,
  loading = false,
  defaultValues,
  isUpdating = false,
}: CreateUserFormProps) {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 3. Set up react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(createUserSchema(isUpdating)) as any,
    defaultValues: {
      fullName: defaultValues?.fullName || '',
      phone: defaultValues?.phone || '',
      role: defaultValues?.role || undefined,
      email: defaultValues?.email || '',
      password: '', // Luôn trống
      avatarUrl: defaultValues?.avatarUrl ? [defaultValues.avatarUrl] : [],
    },
  });

  // Đồng bộ defaultValues khi thay đổi
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        fullName: defaultValues.fullName || '',
        phone: defaultValues.phone || '',
        role: defaultValues.role || undefined,
        email: defaultValues.email || '',
        password: '',
        avatarUrl: defaultValues.avatarUrl ? [defaultValues.avatarUrl] : [],
      });
    }
  }, [defaultValues, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const finalValues = {
      ...values,
      avatarUrl: values.avatarUrl?.[0] || '', // Chỉ lấy ảnh đầu tiên
      isActive: true,
    };

    // Xóa password nếu không được cung cấp khi cập nhật
    if (isUpdating && !finalValues.password) {
      delete (finalValues as any).password;
    }

    onSubmit?.(finalValues);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel>Ảnh đại diện</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(urls) => field.onChange(urls)}
                    maxCount={1}
                    toggleUploading={setIsUploadingAvatar}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      className="pl-10 h-10"
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
                      className="pl-10 h-10"
                      maxLength={10}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vai trò</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Chọn vai trò" />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      className="pl-10 h-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isUpdating && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                        className="pl-10 h-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading || isUploadingAvatar}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading || isUploadingAvatar}>
              {(loading || isUploadingAvatar) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdating ? 'Cập nhật' : 'Tạo người dùng'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
