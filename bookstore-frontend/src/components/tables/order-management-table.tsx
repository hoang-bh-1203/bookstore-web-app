// components/table/OrderManagementTable.tsx

import { useCallback, useState } from 'react';
import AdminTable from '@/components/common/custom-table';
import type { CustomTableColumn } from '@/components/common/custom-table';
import type { Order } from '@/constants/interfaces';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, X } from 'lucide-react';
import ModalDetailOrder from '../modals/modal-detail-order';
import { OrderStatus, OrderStatusLabel } from '@/constants/enums';

const OrderManagementTable = () => {
  const rawOrders = useLoaderData() as Order[];
  const revalidator = useRevalidator();

  const getStatusVariant = (
    status: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return 'default'; // Blue-ish usually
      case OrderStatus.DELIVERED:
        return 'secondary'; // Orange-ish maybe, depends on theme, adjust if needed
      case OrderStatus.COMPLETED:
        return 'outline'; // Green-ish usually implies success, outline works or custom class
      case OrderStatus.CANCELLED:
        return 'destructive'; // Red
      default:
        return 'secondary';
    }
  };

  // Custom badge styling might be needed if default variants don't match desired colors exactly
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
    { key: 'customerName', title: 'Customer', dataIndex: 'customerName' },
    {
      key: 'totalPrice',
      title: 'Total price',
      dataIndex: 'totalPrice',
      render: (value) => `${Number(value).toLocaleString()} đ`,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status: any) => <StatusBadge status={status} />,
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id', // Dummy dataIndex
      align: 'center',
      width: 100,
      render: (_, record) => (
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

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleDetail = useCallback((order: Order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  }, []);

  const filteredOrders = rawOrders?.filter((order: Order) => {
    const matchName = order.customerName
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    return matchName && matchStatus;
  });

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Quản lý đơn hàng
        </h3>

        {/* Bộ lọc */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên khách hàng"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Filter */}
          <Select
            value={statusFilter || undefined}
            onValueChange={(value) => setStatusFilter(value || null)}
          >
            <SelectTrigger className="w-full sm:w-48">
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

          <Button
            variant="outline"
            onClick={() => {
              setSearchText('');
              setStatusFilter(null);
            }}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Bỏ lọc
          </Button>
        </div>

        {/* Table */}
        <div className="-mx-6">
          <AdminTable<Order>
            data={filteredOrders}
            columns={columns}
            showActions={false}
            className="p-0 border-none shadow-none rounded-none"
          />
        </div>
      </div>

      <ModalDetailOrder
        title="Chi tiết đơn hàng"
        onCancel={() => setOpenDetailModal(false)}
        open={openDetailModal}
        order={selectedOrder}
        onUpdate={() => revalidator.revalidate()}
      />
    </>
  );
};

export default OrderManagementTable;
