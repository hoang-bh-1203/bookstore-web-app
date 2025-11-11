import { useCallback, useState } from 'react';
import AdminTable from '@/components/common/custom-table';
import type { CustomTableColumn } from '@/components/common/custom-table';
import type { Order } from '@/constants/interfaces';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, X } from 'lucide-react';
import dayjs from 'dayjs';
import { OrderStatus, OrderStatusLabel } from '@/constants/enums';

const OrderListTable = () => {
  const navigate = useNavigate();
  const rawOrders = useLoaderData() as Order[];
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleDetail = useCallback(
    (order: Order) => {
      navigate(`/profile/orders/${order.id}`);
    },
    [navigate],
  );

  const filteredOrders = rawOrders?.filter((order: Order) => {
    return statusFilter ? order.status === statusFilter : true;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    let className = 'capitalize';
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

  const columns: CustomTableColumn<Order>[] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'STT',
      align: 'center',
      render: (_: any, __: Order, index: number) => index + 1,
    },
    {
      key: 'createdAt',
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      align: 'center',
      render: (value: any) => dayjs(value).format('HH:mm DD/MM/YYYY'),
    },
    {
      key: 'totalPrice',
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      align: 'center',
      render: (value: any) => Number(value).toLocaleString('vi-VN') + ' đ',
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      align: 'center',
      render: (status: any) => <StatusBadge status={status} />,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      dataIndex: 'status',
      align: 'center',
      render: (_: unknown, record: Order) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDetail(record)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">
        Danh sách đơn hàng
      </h3>

      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={statusFilter || undefined}
          onValueChange={(value) => setStatusFilter(value || null)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(OrderStatus).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {OrderStatusLabel[key as keyof typeof OrderStatusLabel]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => setStatusFilter(null)}>
          <X className="mr-2 h-4 w-4" />
          Bỏ lọc
        </Button>
      </div>

      <div className="-mx-6">
        <AdminTable<Order>
          data={filteredOrders}
          columns={columns}
          showActions={false}
          className="p-0 border-none shadow-none rounded-none"
        />
      </div>
    </div>
  );
};

export default OrderListTable;
