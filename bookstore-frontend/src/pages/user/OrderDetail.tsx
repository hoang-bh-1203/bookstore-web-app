// pages/user/OrderDetail.tsx

import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import type { Order } from '@/constants/interfaces';
import { useOrder } from '@/hooks/useOrder';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatus, OrderStatusLabel } from '@/constants/enums';
import { toast } from 'sonner';
import { ChevronLeft, MessageCircle } from 'lucide-react';

const OrderDetail = () => {
  const { updateOrder } = useOrder();
  const revalidator = useRevalidator();
  const order = useLoaderData() as Order;

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCancelOrder = async () => {
    try {
      await updateOrder(order.id, { status: 'cancelled' });
      toast.success('Đã hủy đơn hàng thành công!');
      revalidator.revalidate();
    } catch (error) {
      toast.error('Lỗi khi hủy đơn hàng');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let className = 'capitalize ml-2';
    switch (status) {
      case OrderStatus.CONFIRMED:
        className += ' bg-blue-500 hover:bg-blue-600';
        break;
      case OrderStatus.DELIVERED:
        className += ' bg-orange-500 hover:bg-orange-600';
        break;
      case OrderStatus.COMPLETED:
        className += ' bg-green-500 hover:bg-green-600';
        break;
      case OrderStatus.CANCELLED:
        className += ' bg-red-500 hover:bg-red-600';
        break;
      default:
        break;
    }
    return (
      <Badge className={className}>
        {OrderStatusLabel[
          status.toUpperCase() as keyof typeof OrderStatusLabel
        ] || status}
      </Badge>
    );
  };

  return (
    <div className="font-sans min-h-screen pb-8">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-normal text-foreground">
              Chi tiết đơn hàng #{order.id}
            </h2>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-sm text-muted-foreground">
            Ngày đặt hàng:{' '}
            {order.createdAt ? formatDate(order.createdAt) : 'Không xác định'}
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                Địa chỉ người nhận
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-bold text-foreground">
                {order.customerName.toUpperCase()}
              </p>
              <p className="text-muted-foreground">Địa chỉ: {order.address}</p>
              <p className="text-muted-foreground">
                Điện thoại: {order.phone || '0942438803'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                Hình thức giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <span className="font-medium text-yellow-500">FAST</span> Giao
                hàng nhanh
              </p>
              <p className="text-muted-foreground">Giao trước 13h ngày mai</p>
              <p className="text-muted-foreground">Phí vận chuyển: Miễn phí</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                Hình thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Thanh toán tiền mặt khi nhận hàng
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <Card className="mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-muted-foreground">
                  <th className="py-3 px-4 font-medium">Sản phẩm</th>
                  <th className="py-3 px-4 text-right font-medium">Giá</th>
                  <th className="py-3 px-4 text-center font-medium">
                    Số lượng
                  </th>
                  <th className="py-3 px-4 text-right font-medium">Tạm tính</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.products.map((product) => (
                  <tr key={product.id}>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden">
                          <img
                            src={product.thumbnail || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cung cấp bởi{' '}
                            <span className="text-primary">BS Trading</span>
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-8 gap-1 text-xs"
                          >
                            <MessageCircle className="h-3 w-3" /> Chat với nhà
                            bán
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right align-top">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-4 px-4 text-center align-top">
                      {product.quantity}
                    </td>
                    <td className="py-4 px-4 text-right align-top font-medium">
                      {formatCurrency(product.price * product.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Order Summary & Actions */}
        <div className="flex flex-col items-end gap-6">
          <div className="w-full sm:max-w-xs space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              <span>25.000 ₫</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giảm giá vận chuyển</span>
              <span className="text-green-600">-25.000 ₫</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center pt-1">
              <span className="font-medium text-foreground">Tổng cộng</span>
              <span className="text-xl font-bold text-destructive">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-4 w-full">
            {order.status === OrderStatus.CONFIRMED && (
              <Button variant="destructive" onClick={handleCancelOrder}>
                Hủy đơn hàng
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/profile/orders" className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Quay lại đơn hàng
              </Link>
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950">
              Theo dõi đơn hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
