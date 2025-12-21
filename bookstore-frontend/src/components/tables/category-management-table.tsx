// components/table/CategoryManagementTable.tsx

import { useState, useCallback, useRef } from 'react';
import type { CustomTableColumn } from '@/components/common/custom-table';
import AdminTable from '@/components/common/custom-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Category } from '@/constants/interfaces';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import ModalFormCreateCategory from '../modals/modal-form-create-category';
import { useCategory } from '@/hooks/useCategory';
import ModalConfirm from '../modals/modal-confirm';
import { toast } from 'sonner';

const columns: CustomTableColumn<Category>[] = [
  { key: 'id', title: 'ID', dataIndex: 'id', align: 'center', width: 80 },
  { key: 'name', title: 'Categories', dataIndex: 'name', align: 'center' },
  {
    key: 'parentName',
    title: 'Parent Category',
    dataIndex: 'parent',
    align: 'center',
    render: (value: any) => (value ? value.name : 'No Parent'),
  },
];

const CategoryManagementTable = () => {
  const categories = useLoaderData() as Category[];
  const { createCategory, updateCategory, deleteCategory } = useCategory();
  const revalidator = useRevalidator();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );

  const categoryToDeleteRef = useRef<Category | null>(null);

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
      revalidator.revalidate();
    } catch (error) {
      console.error('Xóa danh mục thất bại:', error);
      toast.error('Xóa danh mục thất bại!');
    } finally {
      categoryToDeleteRef.current = null;
      setIsOpenModalDelete(false);
    }
  }, [deleteCategory, revalidator]);

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
        revalidator.revalidate();
      } catch (error) {
        console.error('Error:', error);
        toast.error('Hành động thất bại!');
      } finally {
        setIsOpenModal(false);
      }
    },
    [createCategory, isEditing, updateCategory, revalidator, editingCategory],
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
        <AdminTable<Category>
          data={categories}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          className="p-0 border-none shadow-none rounded-none"
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
