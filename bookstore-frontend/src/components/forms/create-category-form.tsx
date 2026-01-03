// components/forms/CreateCategoryForm.tsx

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
import { Loader2, LayoutGrid } from 'lucide-react';
import type { Category } from '@/constants/interfaces';
import SearchableSelector from '@/components/common/searchable-selector';
import { useCategory } from '@/hooks/useCategory';
import { useEffect, useMemo } from 'react';

// 1. Zod Schema
const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự.')
    .max(50, 'Tên không được vượt quá 50 ký tự.'),
  parentId: z.number().optional().nullable(),
});

const getParentId = (data?: Category | any) => {
  if (!data) return undefined;
  if (data.parent?.id) return data.parent.id;
  if (data.parentId) return data.parentId;
  return undefined;
};

type FormValues = z.infer<typeof formSchema>;

interface CreateCategoryFormProps {
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  defaultValues?: Category;
}

export default function CreateCategoryForm({
  onSubmit,
  onCancel,
  loading = false,
  defaultValues,
}: CreateCategoryFormProps) {
  const { searchCategories } = useCategory();

  // 2. useForm Hook
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      parentId: getParentId(defaultValues),
    },
  });

  const initialParentCategory = useMemo(() => {
    if (!defaultValues) return undefined;
    if (defaultValues.parent) return defaultValues.parent;

    const flatData = defaultValues as any;
    if (flatData.parentId && flatData.parentName) {
      return {
        id: flatData.parentId,
        name: flatData.parentName,
        parent: null,
      } as Category;
    }

    return undefined;
  }, [defaultValues]);

  // Sync default values when they change (for editing)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name || '',
        parentId: getParentId(defaultValues),
      });
    }
  }, [defaultValues, form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit?.(values);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 3. Shadcn Form Component */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên danh mục</FormLabel>
                <FormControl>
                  <div className="relative">
                    <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nhập tên danh mục"
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
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục cha (Tùy chọn)</FormLabel>
                <FormControl>
                  <SearchableSelector<Category>
                    placeholder="Chọn danh mục cha"
                    valueKey="id"
                    labelKey="name"
                    pageSize={10}
                    key={
                      defaultValues?.id
                        ? `edit-${defaultValues.id}`
                        : 'create-new'
                    }
                    defaultValue={initialParentCategory}
                    fetchData={searchCategories}
                    onSelect={(option) => {
                      field.onChange(option ? option.id : null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {defaultValues ? 'Sửa danh mục' : 'Tạo danh mục'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
