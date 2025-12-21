// components/modal/ModalDetailOrder.tsx

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '@/constants/interfaces';
import { useOrder } from '@/hooks/useOrder';
import { Label } from '@/components/ui/label';

interface OrderModalProps {
  title: string;
  order: Order | null;
  open: boolean;
  onCancel: () => void;
  onUpdate?: () => void;
  cancelText?: string;
  loading?: boolean;
}

const ModalDetailOrder: React.FC<OrderModalProps> = ({
  title,
  order,
  open,
  onCancel,
  cancelText = 'Đóng',
  loading = false,
  onUpdate,
}) => {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { updateOrder } = useOrder();

  useEffect(() => {
    if (open && order) {
      setStatus(order.status);
    }
  }, [order, open]);

  const handleUpdate = async () => {
    if (!order || !status) return;

    try {
      await updateOrder(order.id, {
        status,
      });
      toast.success('Cập nhật trạng thái thành công');
      onCancel();
      onUpdate?.();
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật đơn hàng');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {order && (
          <div className="py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Khách hàng</Label>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tổng tiền</Label>
                <p className="font-medium">
                  {order.totalPrice.toLocaleString()} đ
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái đơn hàng</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="w-[250px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivered">Đang giao hàng</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Đã giao hàng</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Danh sách sản phẩm</h4>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-right">Số lượng</TableHead>
                      <TableHead className="text-right">Giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products.map((product: any) => (
                      <TableRow key={product.id || product.name}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.price.toLocaleString()} đ
                        </TableCell>
                        <TableCell className="text-right">
                          {(product.price * product.quantity).toLocaleString()}{' '}
                          đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailOrder;
