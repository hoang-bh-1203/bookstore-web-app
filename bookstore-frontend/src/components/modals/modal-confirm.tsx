import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  description: string;
  open: boolean;
  onOk: () => void;
  onCancel: (open: boolean) => void; // Shadcn onOpenChange
  okText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ModalConfirm: React.FC<ConfirmModalProps> = ({
  title,
  description,
  open,
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
  loading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelText}</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={(e) => {
              e.preventDefault(); // Ngăn chặn đóng dialog ngay lập tức nếu cần async
              onOk();
            }}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {okText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalConfirm;
