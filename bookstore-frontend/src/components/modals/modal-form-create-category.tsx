import type { Category } from '@/constants/interfaces';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CreateCategoryForm from '../forms/create-category-form';

interface ModalFormCreateCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (values: Category) => void;
  defaultValues?: Category;
  loading?: boolean;
}

const ModalFormCreateCategory = ({
  isOpen,
  onClose,
  handleSubmit,
  defaultValues,
  loading = false,
}: ModalFormCreateCategoryProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? 'Sửa danh mục' : 'Tạo danh mục'}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <CreateCategoryForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
            defaultValues={defaultValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFormCreateCategory;
