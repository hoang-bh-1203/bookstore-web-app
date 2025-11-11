// components/modal/ModalFormCreateBook.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Book } from '@/constants/interfaces';
import CreateBookForm from '../forms/create-book-form';

interface ModalFormCreateBookProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (values: Book) => void;
  loading?: boolean;
  defaultValues?: Book;
}

export default function ModalFormCreateBook({
  isOpen,
  onClose,
  handleSubmit,
  loading = false,
  defaultValues,
}: ModalFormCreateBookProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? 'Cập nhật sách' : 'Tạo sách mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <CreateBookForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
            isUpdating={!!defaultValues}
            defaultValues={defaultValues}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
