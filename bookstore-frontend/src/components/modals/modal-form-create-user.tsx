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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? 'Cập nhật người dùng' : 'Tạo người dùng mới'}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4">
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
