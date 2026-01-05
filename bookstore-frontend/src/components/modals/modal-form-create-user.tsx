import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CreateUserForm from '../forms/create-user-form';
import type { User } from '@/constants/interfaces';

interface ModalFormCreateUserProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: (values: User) => void;
  defaultValues?: User;
  loading?: boolean;
}

export default function ModalFormCreateUser({
  isOpen,
  onClose,
  handleSubmit,
  defaultValues,
  loading = false,
}: ModalFormCreateUserProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[550px] max-h-[90vh] p-0 gap-0 flex flex-col"
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {defaultValues ? 'Cập nhật người dùng' : 'Tạo người dùng mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <CreateUserForm
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
