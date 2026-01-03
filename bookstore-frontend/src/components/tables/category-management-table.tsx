// components/table/CategoryManagementTable.tsx

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { CustomTableColumn } from '@/components/common/custom-table';
import AdminTable from '@/components/common/custom-table';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import type {
  Category,
  PageableParams,
  PagedResponse,
} from '@/constants/interfaces';
import { useLoaderData } from 'react-router-dom';
import ModalFormCreateCategory from '../modals/modal-form-create-category';
import { useCategory } from '@/hooks/useCategory';
import ModalConfirm from '../modals/modal-confirm';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { debounce } from 'lodash';

const columns: CustomTableColumn<Category>[] = [
  { key: 'name', title: 'Tên danh mục', dataIndex: 'name', align: 'center' },
  {
    key: 'parentName',
    title: 'Tên danh mục cha',
    dataIndex: 'parentName' as keyof Category,
    align: 'center',
  },
];

const CategoryManagementTable = () => {
  const defaultCategories = useLoaderData() as PagedResponse<Category>;
  const { getAllCategories, createCategory, updateCategory, deleteCategory } =
    useCategory();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>(
    defaultCategories.data || [],
  );

  const categoryToDeleteRef = useRef<Category | null>(null);

  const fetchCategories = useCallback(
    async (params: PageableParams) => {
      setLoading(true);
      try {
        const response = await getAllCategories({
          ...params,
          page: (params.page || 1) - 1,
        });
        setCategories(response.data);
        setPagination((prev) => ({ ...prev, total: response.totalElements }));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    },
    [getAllCategories],
  );

  const debouncedFetchCategories = useMemo(
    () => debounce(fetchCategories, 500),
    [fetchCategories],
  );

  useEffect(() => {
    const params: PageableParams = {
      page: pagination.page,
      size: pagination.size,
    };
    if (sorter.field && sorter.order)
      params.sort = `${sorter.field},${sorter.order}`;
    if (keyword) params.keyword = keyword;
    debouncedFetchCategories(params);
    return () => {
      debouncedFetchCategories.cancel();
    };
  }, [
    pagination.page,
    pagination.size,
    sorter,
    keyword,
    debouncedFetchCategories,
  ]);

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setEditingCategory(undefined);
    setIsEditing(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsOpenModal(true);
    setIsEditing(true);
  };

  const handleDelete = useCallback((category: Category) => {
    categoryToDeleteRef.current = category;
    setIsOpenModalDelete(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const category = categoryToDeleteRef.current;
    if (!category) return;

    try {
      await deleteCategory(category.id);
      toast.success('Xóa danh mục thành công!');

      const params: PageableParams = {
        page: pagination.page,
        size: pagination.size,
        keyword: keyword,
      };
      if (sorter.field && sorter.order) {
        params.sort = `${sorter.field},${sorter.order}`;
      }
      await fetchCategories(params);
    } catch (error) {
      console.error('Xóa danh mục thất bại:', error);
      toast.error('Xóa danh mục thất bại!');
    } finally {
      categoryToDeleteRef.current = null;
      setIsOpenModalDelete(false);
    }
  }, [deleteCategory, fetchCategories, pagination, keyword, sorter]);

  const handleCancelDelete = useCallback((open: boolean) => {
    if (!open) {
      categoryToDeleteRef.current = null;
      setIsOpenModalDelete(false);
    }
  }, []);

  const handleSubmitForm = useCallback(
    async (values: Category) => {
      try {
        if (isEditing && editingCategory) {
          await updateCategory(editingCategory.id, values);
          toast.success('Cập nhật danh mục thành công!');
        } else {
          await createCategory(values);
          toast.success('Tạo danh mục thành công!');
        }

        const params: PageableParams = {
          page: pagination.page,
          size: pagination.size,
          keyword: keyword,
        };
        if (sorter.field && sorter.order) {
          params.sort = `${sorter.field},${sorter.order}`;
        }
        await fetchCategories(params);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Hành động thất bại!');
      } finally {
        setIsOpenModal(false);
      }
    },
    [
      createCategory,
      isEditing,
      updateCategory,
      editingCategory,
      fetchCategories,
      pagination,
      keyword,
      sorter,
    ],
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex px-6 py-4 justify-between items-center border-b">
          <h3 className="text-lg font-semibold text-foreground">
            Quản lý danh mục
          </h3>

          <Button onClick={() => setIsOpenModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo danh mục mới
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 p-6 border-b">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="pl-8"
            />
          </div>

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
              <SelectItem value="name">Tên danh mục</SelectItem>
            </SelectContent>
          </Select>

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

        <AdminTable<Category>
          data={categories}
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

      <ModalFormCreateCategory
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        handleSubmit={handleSubmitForm}
        defaultValues={editingCategory}
      />

      <ModalConfirm
        title="Xác nhận xóa danh mục"
        description="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        open={isOpenModalDelete}
      />
    </>
  );
};

export default CategoryManagementTable;
