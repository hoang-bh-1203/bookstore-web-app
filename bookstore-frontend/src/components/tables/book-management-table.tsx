// components/table/BookManagementTable.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import AdminTable, {
  type CustomTableColumn,
} from '@/components/common/custom-table';
import type { Book, Category, ImageBook } from '@/constants/interfaces';
import { useLoaderData, useRevalidator } from 'react-router-dom';
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

const BookManagementTable = () => {
  const books = useLoaderData() as Book[];
  const [openModal, setOpenModal] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [fieldSelected, setFieldSelected] = useState<string | undefined>(
    undefined,
  );
  const [booksShowed, setBooksShowed] = useState(books);
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>(undefined);
  const { createBook, deleteBook, updateBook } = useBook();
  const revalidator = useRevalidator();
  const { getAllCategories } = useCategory();
  const [categoriesOption, setCategoriesOption] = useState<Category[]>([]);

  const userToDeleteRef = useRef<Book | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getAllCategories();
      setCategoriesOption(data);
    })();
  }, [getAllCategories]);

  useEffect(() => {
    if (!books) return;
    setBooksShowed(books);
  }, [books]);

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
      revalidator.revalidate();
    } catch (error) {
      console.error('Xóa sách thất bại:', error);
      toast.error('Xóa sách thất bại!');
    } finally {
      userToDeleteRef.current = null;
      setOpenModalDelete(false);
    }
  }, [deleteBook, revalidator]);

  const handleSubmitForm = useCallback(
    async (values: Book) => {
      try {
        if (isEditing && editingBook) {
          await updateBook(editingBook.id, {
            ...editingBook,
            ...values, // Spread values to update all fields
          });
          setIsEditing(false);
          setEditingBook(undefined);
          toast.success('Cập nhật sách thành công!');
        } else {
          await createBook(values);
          toast.success('Tạo sách mới thành công!');
        }
        revalidator.revalidate();
      } catch (error) {
        console.error('Error submitting book:', error);
        toast.error(
          isEditing ? 'Cập nhật sách thất bại!' : 'Tạo sách mới thất bại!',
        );
      } finally {
        setOpenModal(false);
      }
    },
    [createBook, isEditing, updateBook, revalidator, editingBook],
  );

  const searchBooksByName = function (text: string) {
    if (text === '') setBooksShowed(books);
    else {
      const result = books.filter((book) =>
        book.name.toLowerCase().includes(text.toLowerCase()),
      );
      setBooksShowed(result);
    }
  };

  const sortBooks = (field: keyof Book, order: 'asc' | 'desc') => {
    const sortedBooks = [...booksShowed].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA === valB) return 0;
      if (order === 'asc') return valA > valB ? 1 : -1;
      else return valA > valB ? -1 : 1;
    });
    setBooksShowed(sortedBooks);
  };

  const columns: CustomTableColumn<Book>[] = [
    {
      key: 'images',
      title: 'Ảnh bìa',
      dataIndex: 'images',
      width: 100,
      render: (value) => {
        if (!Array.isArray(value) || value.length === 0) return '-';
        const imageUrl = value[0]?.baseUrl;
        if (!imageUrl) return '-';
        return (
          <img
            src={imageUrl}
            alt="Sách"
            className="w-20 h-[120px] object-cover rounded-md border"
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
      render: (value) => {
        if (!Array.isArray(value)) return '-';
        return value.map((author) => author?.name || '-').join(', ');
      },
    },
    {
      key: 'originalPrice',
      title: 'Giá gốc',
      dataIndex: 'originalPrice',
      align: 'center',
      render: (value) => `${Number(value).toLocaleString()} VND`,
    },
    {
      key: 'categoriesId',
      title: 'Phân loại',
      dataIndex: 'categoriesId',
      align: 'center',
      width: 100,
      render: (value) =>
        categoriesOption.find((c) => c.id === value)?.name || '-',
    },
    {
      key: 'quantitySold',
      title: 'Đã bán',
      dataIndex: 'quantitySold',
      align: 'center',
      render: (value) => `${value} quyển`,
    },
    {
      key: 'shortDescription',
      title: 'Mô tả ngắn',
      dataIndex: 'shortDescription',
      width: 200,
      render: (value: any) =>
        value ? (
          <span className="line-clamp-4 text-sm" title={value}>
            {value}
          </span>
        ) : (
          '-'
        ),
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
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên sách"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                searchBooksByName(e.target.value);
              }}
              className="pl-8"
            />
          </div>

          <Select
            value={fieldSelected}
            onValueChange={(value) => {
              setFieldSelected(value);
              if (value && order) sortBooks(value as keyof Book, order);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trường sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quantitySold">Số lượng đã bán</SelectItem>
              <SelectItem value="originalPrice">Giá gốc</SelectItem>
              <SelectItem value="name">Tên sách</SelectItem>
              {/* authors is complex to sort simply like this, might need custom logic */}
            </SelectContent>
          </Select>

          <Select
            value={order}
            onValueChange={(value: 'asc' | 'desc') => {
              setOrder(value);
              if (fieldSelected) sortBooks(fieldSelected as keyof Book, value);
            }}
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

        <AdminTable<Book>
          data={booksShowed}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          className="p-0 border-none shadow-none rounded-none"
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
