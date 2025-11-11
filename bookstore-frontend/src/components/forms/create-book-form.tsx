// components/forms/CreateBookForm.tsx

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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Author, Book, Category, ImageBook } from '@/constants/interfaces';
import { useCategory } from '@/hooks/useCategory.ts';
import useUpload from '@/hooks/useUpload.ts';
import ImageUpload from '../common/image-uploader';

interface CreateBookFormProps {
  onSubmit?: (values: Book) => void;
  onCancel?: () => void;
  loading?: boolean;
  defaultValues?: Book;
  isUpdating?: boolean;
}

// 1. Zod Schema
const positiveNumberString = (message: string) =>
  z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message });

const formSchema = z.object({
  name: z.string().min(1, 'Tên sách không được để trống'),
  authors: z.string().min(1, 'Tác giả không được để trống'),
  categoriesId: z.coerce.number({ required_error: 'Vui lòng chọn danh mục!' }),
  originalPrice: positiveNumberString('Giá gốc phải lớn hơn 0'),
  listPrice: positiveNumberString('Giá niêm yết phải lớn hơn 0'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  // Thông số kỹ thuật
  publisherVn: z.string().min(1, 'Vui lòng nhập công ty phát hành'),
  publicationDate: z.string().min(1, 'Vui lòng nhập năm xuất bản'),
  dimensions: z.string().min(1, 'Vui lòng nhập kích thước'),
  dichGia: z.string().min(1, 'Vui lòng nhập dịch giả'),
  bookCover: z.string().min(1, 'Vui lòng nhập loại bìa'),
  numberOfPage: positiveNumberString('Số trang phải lớn hơn 0'),
  manufacturer: z.string().min(1, 'Vui lòng nhập nhà xuất bản'),
  // Ảnh
  images: z.array(z.string()).min(1, 'Vui lòng tải lên ít nhất 1 ảnh!'),
});

type FormValues = z.infer<typeof formSchema>;

const attributeDefinitions = [
  { code: 'publisherVn', name: 'Công ty phát hành' },
  { code: 'publicationDate', name: 'Năm xuất bản' },
  { code: 'dimensions', name: 'Kích thước' },
  { code: 'dichGia', name: 'Dịch Giả' },
  { code: 'bookCover', name: 'Loại bìa' },
  { code: 'numberOfPage', name: 'Số trang' },
  { code: 'manufacturer', name: 'Nhà xuất bản' },
] as const; // Dùng 'as const' để type-safe

export default function CreateBookForm({
  onSubmit,
  onCancel,
  loading = false,
  isUpdating = false,
  defaultValues,
}: CreateBookFormProps) {
  const { uploadImage } = useUpload();
  const { getAllCategories } = useCategory();
  const [isUploading, setIsUploading] = useState(false);
  const [categoriesOption, setCategoriesOption] = useState<Category[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      authors: defaultValues?.authors?.map((a) => a.name).join(', ') || '',
      categoriesId: defaultValues?.categoriesId || undefined,
      originalPrice: String(defaultValues?.originalPrice || ''),
      listPrice: String(defaultValues?.listPrice || ''),
      shortDescription: defaultValues?.shortDescription || '',
      description: defaultValues?.description || '',
      publisherVn: defaultValues?.publisherVn || '',
      publicationDate: defaultValues?.publicationDate || '',
      dimensions: defaultValues?.dimensions || '',
      dichGia: defaultValues?.dichGia || '',
      bookCover: defaultValues?.bookCover || '',
      numberOfPage: String(defaultValues?.numberOfPage || ''),
      manufacturer: defaultValues?.manufacturer || '',
      images: defaultValues?.images?.map((img) => img.baseUrl) || [],
    },
  });

  // ----------------------------------- PROCESS ------------------------------------
  useEffect(() => {
    (async () => {
      const data = await getAllCategories();
      setCategoriesOption(data);
    })();
  }, [getAllCategories]);

  // Đồng bộ defaultValues (khi edit)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name || '',
        authors: defaultValues.authors?.map((a) => a.name).join(', ') || '',
        categoriesId: defaultValues.categoriesId || undefined,
        originalPrice: String(defaultValues.originalPrice || ''),
        listPrice: String(defaultValues.listPrice || ''),
        shortDescription: defaultValues.shortDescription || '',
        description: defaultValues.description || '',
        publisherVn: defaultValues.publisherVn || '',
        publicationDate: defaultValues.publicationDate || '',
        dimensions: defaultValues.dimensions || '',
        dichGia: defaultValues.dichGia || '',
        bookCover: defaultValues.bookCover || '',
        numberOfPage: String(defaultValues.numberOfPage || ''),
        manufacturer: defaultValues.manufacturer || '',
        images: defaultValues.images?.map((img) => img.baseUrl) || [],
      });
    }
  }, [defaultValues, form]);

  const handleSubmit = async (formValues: FormValues) => {
    // Logic xử lý tác giả
    const authors: Author[] = formValues.authors
      .split(',')
      .map((name: string) => name.trim())
      .filter((name: string) => name.length > 0)
      .map((name: string) => ({
        id: 0,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      }));

    // Logic xử lý ảnh (đã được ImageUploader xử lý, chỉ cần map lại)
    const images: ImageBook[] = formValues.images.map((url) => ({
      baseUrl: url,
      isGallery: url.includes('gallery'),
      label: '',
      largeUrl: url,
      mediumUrl: url,
      smallUrl: url,
      thumbnailUrl: url,
    }));

    // Tập hợp thành phần lại tạo thành sách
    const book: Partial<Book> = {
      name: formValues.name,
      authors,
      description: formValues.description ?? '',
      images,
      originalPrice: Number(formValues.originalPrice),
      listPrice: Number(formValues.listPrice),
      shortDescription: formValues.shortDescription ?? '',
      categoriesId: formValues.categoriesId,
      publisherVn: formValues.publisherVn,
      publicationDate: formValues.publicationDate,
      dimensions: formValues.dimensions,
      dichGia: formValues.dichGia,
      bookCover: formValues.bookCover,
      numberOfPage: Number(formValues.numberOfPage),
      manufacturer: formValues.manufacturer,
      thumbnailUrl: images[0]?.baseUrl || '',
    };

    onSubmit?.(book as Book);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Thông tin chung
          </h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sách</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên sách"
                    {...field}
                    disabled={isUpdating}
                  />
                </FormControl>{' '}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tác giả</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tác giả (cách nhau bởi dấu phẩy ,)"
                    {...field}
                    disabled={isUpdating}
                  />
                </FormControl>{' '}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoriesId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                  disabled={isUpdating}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesOption.map((option) => (
                      <SelectItem key={option.id} value={String(option.id)}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá gốc (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      disabled={isUpdating}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="listPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá niêm yết (VND)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả ngắn</FormLabel>
                <FormControl>
                  <Textarea placeholder="Mô tả ngắn gọn..." {...field} />
                </FormControl>{' '}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả chi tiết</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả chi tiết sản phẩm..."
                    {...field}
                    rows={5}
                  />
                </FormControl>{' '}
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="text-lg font-semibold text-foreground pt-4 border-t">
            Thông tin chi tiết
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributeDefinitions.map((attr) => (
              <FormField
                key={attr.code}
                control={form.control}
                name={attr.code}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{attr.name}</FormLabel>
                    <FormControl>
                      <Input placeholder={attr.name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <h3 className="text-lg font-semibold text-foreground pt-4 border-t">
            Ảnh sản phẩm
          </h3>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(urls) => field.onChange(urls)}
                    maxCount={5} // Cho phép 5 ảnh
                    multiple={true}
                    toggleUploading={setIsUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading || isUploading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading || isUploading}>
              {(loading || isUploading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdating ? 'Cập nhật sách' : 'Tạo sách mới'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
