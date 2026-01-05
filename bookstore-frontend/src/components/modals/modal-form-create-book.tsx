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
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[700px] max-h-[90vh] p-0 gap-0 flex flex-col"
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {defaultValues ? 'Cập nhật sách' : 'Tạo sách mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 pt-2">
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
