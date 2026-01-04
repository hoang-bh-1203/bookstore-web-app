// components/forms/CreateBookForm.tsx

import { useState, useEffect, useMemo } from 'react';
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
import { Loader2 } from 'lucide-react';
import type { Book, Category } from '@/constants/interfaces';
import { useCategory } from '@/hooks/useCategory.ts';
import ImageUpload from '../common/image-uploader';
import SearchableSelector from '@/components/common/searchable-selector';

interface CreateBookFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  defaultValues?: Book;
  isUpdating?: boolean;
}

// 1. Zod Schema
const positiveNumberString = (message: string) =>
  z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message });

const formSchema = z.object({
  name: z.string().min(1, 'Tên sách không được để trống'),
  authors: z.string().min(1, 'Tác giả không được để trống'),

  // Dùng number vì SearchableSelector trả về ID dạng number
  categoryId: z.number({ required_error: 'Vui lòng chọn danh mục!' }),

  price: positiveNumberString('Giá gốc phải lớn hơn hoặc bằng 0'),
  discount: positiveNumberString(
    'Giảm giá (%) phải lớn hơn hoặc bằng 0',
  ).optional(),
  stockQuantity: positiveNumberString('Số lượng tồn kho phải lớn hơn 0'),

  shortDescription: z.string().optional(),
  description: z.string().optional(),

  publisher: z.string().min(1, 'Vui lòng nhập nhà xuất bản'),
  publisherDate: z.string().min(1, 'Vui lòng nhập ngày/năm xuất bản'),
  dimension: z.string().min(1, 'Vui lòng nhập kích thước'),
  numberOfPages: positiveNumberString('Số trang phải lớn hơn 0'),
  isbn: z.string().min(1, 'Vui lòng nhập ISBN'),

  // Form chỉ quản lý danh sách URL (string[]) cho ImageUpload hiển thị
  images: z.array(z.string()).min(1, 'Vui lòng tải lên ít nhất 1 ảnh!'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateBookForm({
  onSubmit,
  onCancel,
  loading = false,
  isUpdating = false,
  defaultValues,
}: CreateBookFormProps) {
  const { searchCategories } = useCategory();
  const [isUploading, setIsUploading] = useState(false);

  // 2. Logic khởi tạo Category ban đầu
  const initialCategory = useMemo(() => {
    if (!defaultValues) return undefined;
    if (defaultValues.categoryId && defaultValues.categoryName) {
      return {
        id: defaultValues.categoryId,
        name: defaultValues.categoryName,
      } as Category;
    }
    return undefined;
  }, [defaultValues]);

  // 3. Setup Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      authors: '',
      categoryId: undefined,
      price: '',
      discount: '0',
      stockQuantity: '0',
      shortDescription: '',
      description: '',
      publisher: '',
      publisherDate: '',
      dimension: '',
      numberOfPages: '',
      isbn: '',
      images: [],
    },
  });

  // 4. Reset Form khi có defaultValues (Edit Mode)
  useEffect(() => {
    if (defaultValues) {
      // Map từ Object Backend [{imageUrl: "..."}] -> Form Frontend ["..."]
      const existingImages = Array.isArray(defaultValues.images)
        ? defaultValues.images.map((img) => img.imageUrl)
        : [];

      form.reset({
        name: defaultValues.name || '',
        authors: Array.isArray(defaultValues.authors)
          ? defaultValues.authors.map((a) => a.name).join(', ')
          : '',

        categoryId: defaultValues.categoryId,

        price: String(defaultValues.price || 0),
        discount: String(defaultValues.discount || 0),
        stockQuantity: String(defaultValues.stockQuantity || 0),
        shortDescription: defaultValues.shortDescription || '',
        description: defaultValues.description || '',
        publisher: defaultValues.publisher || '',
        publisherDate: defaultValues.publisherDate || '',
        dimension: defaultValues.dimension || '',
        numberOfPages: String(defaultValues.numberOfPages || ''),
        isbn: defaultValues.isbn || '',

        images: existingImages,
      });
    }
  }, [defaultValues, form]);

  // 5. Handle Submit
  const handleSubmit = async (formValues: FormValues) => {
    // a. Xử lý Authors
    const authorsReq = formValues.authors
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .map((name) => ({ name }));

    // b. Xử lý Images (QUAN TRỌNG):
    // Logic: Map từ danh sách URL (String) -> Danh sách Object (Backend DTO)
    // Nếu URL đã tồn tại trong defaultValues, lấy lại ID của nó (để Backend biết là update).
    // Nếu URL là mới, không gửi ID (để Backend biết là tạo mới).

    const imagesReq = formValues.images.map((url) => {
      const existingImage = defaultValues?.images?.find(
        (img) => img.imageUrl === url,
      );

      if (existingImage) {
        // Ảnh cũ -> Giữ nguyên ID + URL
        return { id: existingImage.id, imageUrl: url };
      }

      // Ảnh mới -> Chỉ có URL
      return { imageUrl: url };
    });

    const payload = {
      ...formValues,
      price: Number(formValues.price),
      discount: Number(formValues.discount),
      stockQuantity: Number(formValues.stockQuantity),
      numberOfPages: Number(formValues.numberOfPages),
      authors: authorsReq,
      images: imagesReq, // Gửi list object đã xử lý ID
    };

    // console.log("Payload submit:", payload); // Debug để kiểm tra payload
    onSubmit?.(payload);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* --- SECTION 1: THÔNG TIN CƠ BẢN --- */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Thông tin chung
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên sách <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên sách" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Danh mục <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SearchableSelector<Category>
                          placeholder="Chọn danh mục"
                          valueKey="id"
                          labelKey="name"
                          pageSize={100}
                          key={
                            defaultValues?.id
                              ? `edit-${defaultValues.id}`
                              : 'create-new'
                          }
                          defaultValue={initialCategory}
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

                <FormField
                  control={form.control}
                  name="authors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tác giả (ngăn cách bởi dấu phẩy){' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: Nguyễn Nhật Ánh, J.K. Rowling"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* --- SECTION 2: GIÁ & KHO --- */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Giá & Tồn kho
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá gốc (VND)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tồn kho</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* --- SECTION 3: MÔ TẢ --- */}
          <div>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả ngắn gọn hiển thị trên card..."
                        {...field}
                      />
                    </FormControl>
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
                        placeholder="Nội dung chi tiết sản phẩm..."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* --- SECTION 4: THÔNG SỐ KỸ THUẬT --- */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Thông số chi tiết
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhà xuất bản</FormLabel>
                    <FormControl>
                      <Input placeholder="NXB Kim Đồng..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publisherDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày xuất bản</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimension"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kích thước</FormLabel>
                    <FormControl>
                      <Input placeholder="14 x 20.5 cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfPages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số trang</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="978-3-16-148410-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* --- SECTION 5: ẢNH --- */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Ảnh sản phẩm
            </h3>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      // Truyền vào mảng String URL
                      value={field.value}
                      // Cập nhật mảng String URL khi upload/delete
                      onChange={(urls) => field.onChange(urls)}
                      maxCount={5}
                      multiple={true}
                      toggleUploading={setIsUploading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* --- ACTION BUTTONS --- */}
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
              {isUpdating ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
