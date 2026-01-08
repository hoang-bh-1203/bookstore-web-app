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
import { AlertCircle, Loader2, XCircle } from 'lucide-react'; // Thêm icon XCircle cho nút hủy
import { toast } from 'sonner';
import type { Order } from '@/constants/interfaces';
import { useOrder } from '@/hooks/useOrder';
import { Label } from '@/components/ui/label';
import { OrderStatus, OrderStatusLabel } from '@/constants/enums';

interface OrderModalProps {
  title: string;
  order: Order | null;
  open: boolean;
  onCancel: () => void;
  onUpdate?: () => void;
  cancelText?: string;
  loading?: boolean;
  readOnly?: boolean; // Prop quan trọng để phân biệt User/Admin
}

const ModalDetailOrder: React.FC<OrderModalProps> = ({
  title,
  order,
  open,
  onCancel,
  cancelText = 'Đóng',
  loading = false,
  onUpdate,
  readOnly = false,
}) => {
  // State lưu trạng thái hiện tại đang chọn (cho Admin)
  const [currentStatus, setCurrentStatus] = useState<string | undefined>(
    undefined,
  );

  // Lấy các hàm và state từ hook useOrder
  const { updateOrder, cancelOrder, isCancelling } = useOrder();

  // Reset status khi mở modal với order mới
  useEffect(() => {
    if (open && order) {
      setCurrentStatus(order.status);
    }
  }, [order, open]);

  // Xử lý cập nhật trạng thái (Dành cho Admin)
  const handleUpdate = async () => {
    if (!order || !currentStatus) return;

    if (currentStatus === order.status) {
      onCancel();
      return;
    }

    try {
      await updateOrder(order.id, {
        status: currentStatus,
      });
      toast.success('Cập nhật trạng thái thành công');
      onCancel();
      onUpdate?.();
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đơn hàng';
      toast.error(msg);
    }
  };

  // Xử lý hủy đơn hàng (Dành cho User)
  const handleCancelOrder = async () => {
    if (!order) return;

    // Xác nhận trước khi hủy
    if (
      !confirm(
        'Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.',
      )
    ) {
      return;
    }

    try {
      await cancelOrder(order.id);
      toast.success('Đã hủy đơn hàng thành công');
      onCancel();
      onUpdate?.(); // Refresh lại danh sách bên ngoài
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || 'Không thể hủy đơn hàng';
      toast.error(msg);
    }
  };

  // Logic kiểm tra điều kiện hiển thị nút hủy cho User
  const canCancel =
    order &&
    (order.status === OrderStatus.PENDING ||
      order.status === OrderStatus.CONFIRMED);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            {title} #{order?.id}
          </DialogTitle>
        </DialogHeader>

        {order && (
          <div className="py-4 space-y-6">
            {/* Thông tin chung */}
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div>
                <Label className="text-muted-foreground">Khách hàng</Label>
                <div className="font-medium">{order.customerName}</div>
                <div className="text-sm text-gray-500">
                  {order.customerEmail}
                </div>
                <div className="text-sm text-gray-500">{order.address}</div>
              </div>
              <div className="text-right">
                <Label className="text-muted-foreground">
                  Tổng tiền đơn hàng
                </Label>
                <p className="font-bold text-xl text-primary">
                  {order.totalAmount.toLocaleString()} đ
                </p>
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground mr-2">
                    Phương thức:
                  </span>
                  <span className="font-medium">{order.methodPayment}</span>
                </div>
              </div>
            </div>

            {/* Cập nhật trạng thái / Hiển thị trạng thái */}
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái đơn hàng</Label>

              {!readOnly ? (
                // --- VIEW CHO ADMIN: Select Box ---
                <>
                  <Select
                    value={currentStatus}
                    onValueChange={(val) => setCurrentStatus(val)}
                    disabled={loading}
                  >
                    <SelectTrigger id="status" className="w-[250px]">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OrderStatus).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {
                            OrderStatusLabel[
                              key as keyof typeof OrderStatusLabel
                            ]
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    * Lưu ý: Trạng thái phải tuân thủ quy trình (Ví dụ: PENDING
                    -&gt; CONFIRMED -&gt; PROCESSING...)
                  </p>
                </>
              ) : (
                // --- VIEW CHO USER: Text ---
                <div className="text-lg font-medium text-primary">
                  {OrderStatusLabel[
                    order.status as keyof typeof OrderStatusLabel
                  ] || order.status}
                </div>
              )}
            </div>

            {/* Danh sách sản phẩm */}
            <div className="space-y-2">
              <h4 className="font-semibold">
                Danh sách sản phẩm ({order.totalItem})
              </h4>
              <div className="border rounded-md max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead className="text-center">SL</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Giảm giá</TableHead>
                      <TableHead className="text-right">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.productPrice.toLocaleString()} đ
                        </TableCell>
                        <TableCell className="text-right text-red-500">
                          -{item.productDiscount?.toLocaleString() || 0} %
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.total.toLocaleString()} đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
          {/* Nút Đóng - Luôn hiển thị */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading || isCancelling}
            >
              {cancelText}
            </Button>
          </div>

          <div className="flex gap-2">
            {/* --- NÚT HỦY ĐƠN (Chỉ hiện cho User + Status hợp lệ) --- */}
            {readOnly && canCancel && (
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Hủy đơn hàng
              </Button>
            )}

            {/* --- NÚT LƯU (Chỉ hiện cho Admin) --- */}
            {!readOnly && (
              <Button onClick={handleUpdate} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetailOrder;
