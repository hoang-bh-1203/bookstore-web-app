import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AdminTable, {
  type CustomTableColumn,
} from '@/components/common/custom-table';
import type {
  Book,
  BookImage,
  Category,
  PageableParams,
  PagedResponse,
} from '@/constants/interfaces';
import { useLoaderData } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import ModalConfirm from '../modals/modal-confirm';
import { useBook } from '@/hooks/useBook.ts';
import ModalFormCreateBook from '../modals/modal-form-create-book';
import { useCategory } from '@/hooks/useCategory.ts';
import { toast } from 'sonner';
import { debounce } from 'lodash';

const BookManagementTable = () => {
  // Giả sử loader trả về PagedResponse<Book> thay vì Book[]
  const defaultBooks = useLoaderData() as PagedResponse<Book>;

  // States cho Data & Pagination
  const [books, setBooks] = useState<Book[]>(defaultBooks?.data || []);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: defaultBooks?.totalElements || 0,
  });
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});

  // States cho Modal & Actions
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const userToDeleteRef = useRef<Book | null>(null);

  // Hooks
  const { createBook, deleteBook, updateBook, getAllBooks } = useBook(); // Đảm bảo useBook có getAllBooks
  const { getAllCategories } = useCategory();

  // State phụ trợ
  const [_categoriesOption, setCategoriesOption] = useState<Category[]>([]);

  // 1. Fetch Categories cho Select box hiển thị tên
  useEffect(() => {
    (async () => {
      const data = await getAllCategories({ page: 0, size: 100 });
      setCategoriesOption(data.data);
    })();
  }, [getAllCategories]);

  // 2. Hàm Fetch Books từ API (Server-side)
  const fetchBooks = useCallback(
    async (params: PageableParams) => {
      setLoading(true);
      try {
        const response = await getAllBooks({
          ...params,
          page: (params.page || 1) - 1,
        });
        setBooks(response.data);
        setPagination((prev) => ({ ...prev, total: response.totalElements }));
      } catch (error) {
        console.error('Failed to fetch books:', error);
        toast.error('Lấy danh sách sách thất bại');
      } finally {
        setLoading(false);
      }
    },
    [getAllBooks],
  );

  const debouncedFetchBooks = useMemo(
    () => debounce(fetchBooks, 500),
    [fetchBooks],
  );

  useEffect(() => {
    const params: PageableParams = {
      page: pagination.page,
      size: pagination.size,
    };
    if (sorter.field && sorter.order)
      params.sort = `${sorter.field},${sorter.order}`;
    if (keyword) params.keyword = keyword;

    debouncedFetchBooks(params);

    return () => {
      debouncedFetchBooks.cancel();
    };
  }, [pagination.page, pagination.size, sorter, keyword, debouncedFetchBooks]);

  // --- Handlers ---

  const handleEdit = useCallback((book: Book) => {
    setEditingBook(book);
    setIsEditing(true);
    setOpenModal(true);
  }, []);

  const handleCloseModal = () => {
    if (isEditing) {
      setEditingBook(undefined);
      setIsEditing(false);
    }
    setOpenModal(false);
  };

  const handleDelete = useCallback((book: Book) => {
    userToDeleteRef.current = book;
    setOpenModalDelete(true);
  }, []);

  const handleCancelDelete = useCallback((open: boolean) => {
    if (!open) {
      userToDeleteRef.current = null;
      setOpenModalDelete(false);
    }
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const book = userToDeleteRef.current;
    if (!book) return;

    try {
      await deleteBook(book.id);
      toast.success('Xóa sách thành công!');

      // Refresh list
      const params: PageableParams = {
        page: pagination.page,
        size: pagination.size,
        keyword: keyword,
      };
      if (sorter.field && sorter.order)
        params.sort = `${sorter.field},${sorter.order}`;
      await fetchBooks(params);
    } catch (error) {
      console.error('Xóa sách thất bại:', error);
      toast.error('Xóa sách thất bại!');
    } finally {
      userToDeleteRef.current = null;
      setOpenModalDelete(false);
    }
  }, [deleteBook, fetchBooks, pagination, keyword, sorter]);

  const handleSubmitForm = useCallback(
    async (values: Book) => {
      try {
        if (isEditing && editingBook) {
          await updateBook(editingBook.id, {
            ...editingBook,
            ...values,
          });
          toast.success('Cập nhật sách thành công!');
        } else {
          await createBook(values);
          toast.success('Tạo sách mới thành công!');
        }

        // Refresh list và đóng modal
        handleCloseModal();

        // Reset về trang 1 hoặc giữ nguyên trang hiện tại tùy logic
        const params: PageableParams = {
          page: pagination.page,
          size: pagination.size,
          keyword: keyword,
        };
        if (sorter.field && sorter.order)
          params.sort = `${sorter.field},${sorter.order}`;
        await fetchBooks(params);
      } catch (error) {
        console.error('Error submitting book:', error);
        toast.error(
          isEditing ? 'Cập nhật sách thất bại!' : 'Tạo sách mới thất bại!',
        );
      }
    },
    [
      createBook,
      isEditing,
      updateBook,
      editingBook,
      fetchBooks,
      pagination,
      keyword,
      sorter,
    ],
  );

  // --- Columns Definition ---
  const columns: CustomTableColumn<Book>[] = [
    {
      key: 'images',
      title: 'Ảnh bìa',
      dataIndex: 'images',
      width: 100,
      render: (value) => {
        const images = value as BookImage[];

        if (!Array.isArray(images) || images.length === 0) return '-';

        const imageUrl = images[0]?.imageUrl;
        if (!imageUrl) return '-';

        return (
          <img
            src={imageUrl}
            alt="Sách"
            className="w-12 h-16 object-cover rounded-md border"
          />
        );
      },
    },
    { key: 'name', title: 'Tên sách', dataIndex: 'name', width: 200 },
    {
      key: 'authors',
      title: 'Tác giả',
      dataIndex: 'authors',
      align: 'center',
      width: 150,
      render: (value: any) => {
        if (Array.isArray(value))
          // Backend trả về list object AuthorResponse {name: string}
          return value.map((a: any) => a.name).join(', ');
        return '-';
      },
    },
    {
      key: 'price',
      title: 'Giá gốc',
      dataIndex: 'price',
      align: 'center',
      render: (value) => `${Number(value).toLocaleString()} VND`,
    },
    {
      key: 'finalPrice', // Thêm cột giá bán thực tế
      title: 'Giá bán',
      dataIndex: 'finalPrice',
      align: 'center',
      render: (value) => `${Number(value).toLocaleString()} VND`,
    },
    {
      key: 'categoryName', // Update: dùng luôn categoryName từ backend trả về
      title: 'Danh mục',
      dataIndex: 'categoryName',
      align: 'center',
      width: 100,
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex px-6 py-4 justify-between items-center border-b">
          <h3 className="text-lg font-semibold text-foreground">
            Quản lý sách
          </h3>
          <Button onClick={() => setOpenModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo sách mới
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 p-6 border-b">
          {/* Search Box */}
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên sách"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 })); // Reset về trang 1 khi search
              }}
              className="pl-8"
            />
          </div>

          {/* Sort Field */}
          <Select
            value={sorter.field}
            onValueChange={(value) =>
              setSorter((prev) => ({ ...prev, field: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trường sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Tên sách</SelectItem>
              <SelectItem value="price">Giá gốc</SelectItem>
              <SelectItem value="finalPrice">Giá bán</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Select
            value={sorter.order}
            onValueChange={(value) =>
              setSorter((prev) => ({ ...prev, order: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chiều sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Tăng dần</SelectItem>
              <SelectItem value="desc">Giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Component */}
        <AdminTable<Book>
          data={books}
          columns={columns}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          className="p-0 border-none shadow-none rounded-none"
          pagination={{
            page: pagination.page,
            size: pagination.size,
            total: pagination.total,
          }}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      </div>

      <ModalFormCreateBook
        isOpen={openModal}
        onClose={handleCloseModal}
        handleSubmit={handleSubmitForm}
        defaultValues={editingBook}
      />

      <ModalConfirm
        title="Xác nhận xóa sách"
        description="Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác."
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        open={openModalDelete}
      />
    </>
  );
};

export default BookManagementTable;
