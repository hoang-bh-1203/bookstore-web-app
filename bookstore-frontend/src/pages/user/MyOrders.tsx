import { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Không cần navigate nữa
import dayjs from 'dayjs';
import { Eye, X } from 'lucide-react';

import AdminTable, {
  type CustomTableColumn,
} from '@/components/common/custom-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import type {
  Order,
  PageableParams,
  ApiResponse,
} from '@/constants/interfaces';
import { OrderStatus, OrderStatusLabel } from '@/constants/enums';
import { useOrder } from '@/hooks/useOrder';
import ModalDetailOrder from '@/components/modals/modal-detail-order';

const OrderListTable = () => {
  // const navigate = useNavigate(); // Bỏ navigate
  const { getMyOrders } = useOrder();

  // --- State cho Modal ---
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // ----------------------

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: PageableParams = {
        page: pagination.page - 1,
        size: pagination.size,
        sort: 'createdAt,desc',
      };

      const response = (await getMyOrders(
        params,
      )) as unknown as ApiResponse<Order>;
      const pagedData = response as any; // Xử lý data linh hoạt theo fix trước đó

      if (pagedData && Array.isArray(pagedData.content)) {
        setOrders(pagedData.content);
        setPagination((prev) => ({
          ...prev,
          total: pagedData.totalElements || 0,
          page: (pagedData.number || 0) + 1,
        }));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch my orders', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [getMyOrders, pagination.page, pagination.size]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // --- SỬA LOGIC HANDLE DETAIL ---
  const handleDetail = useCallback((order: Order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  }, []);
  // -------------------------------

  const safeOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = safeOrders.filter((order: Order) => {
    return statusFilter ? order.status === statusFilter : true;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = 'bg-gray-500 hover:bg-gray-600';
    switch (status) {
      case OrderStatus.PENDING:
        colorClass = 'bg-yellow-500 hover:bg-yellow-600';
        break;
      case OrderStatus.CONFIRMED:
        colorClass = 'bg-blue-500 hover:bg-blue-600';
        break;
      case OrderStatus.PROCESSING:
        colorClass = 'bg-purple-500 hover:bg-purple-600';
        break;
      case OrderStatus.SHIPPING:
        colorClass = 'bg-indigo-500 hover:bg-indigo-600';
        break;
      case OrderStatus.DELIVERED:
        colorClass = 'bg-green-600 hover:bg-green-700';
        break;
      case OrderStatus.CANCELLED:
        colorClass = 'bg-red-500 hover:bg-red-600';
        break;
    }
    return (
      <Badge
        className={`${colorClass} text-white hover:text-white capitalize border-none`}
      >
        {OrderStatusLabel[status as keyof typeof OrderStatusLabel] || status}
      </Badge>
    );
  };

  const columns: CustomTableColumn<Order>[] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'Mã đơn',
      align: 'center',
      render: (value) => <span className="font-mono font-bold">#{value}</span>,
    },
    {
      key: 'createdAt',
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      align: 'center',
      render: (value: any) => dayjs(value).format('HH:mm DD/MM/YYYY'),
    },
    {
      key: 'totalAmount',
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      align: 'right',
      render: (value: any) => (
        <span className="font-semibold text-primary">
          {Number(value).toLocaleString('vi-VN')} đ
        </span>
      ),
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
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Danh sách đơn hàng của bạn
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

          {statusFilter && (
            <Button variant="outline" onClick={() => setStatusFilter(null)}>
              <X className="mr-2 h-4 w-4" />
              Bỏ lọc
            </Button>
          )}
        </div>

        <div className="-mx-6 px-6">
          <AdminTable<Order>
            data={filteredOrders}
            columns={columns}
            loading={loading}
            showActions={false}
            className="p-0 border-none shadow-none rounded-none"
            pagination={{
              page: pagination.page,
              size: pagination.size,
              total: pagination.total,
            }}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        </div>
      </div>

      {/* --- RENDER MODAL --- */}
      <ModalDetailOrder
        title="Chi tiết đơn hàng"
        open={openDetailModal}
        order={selectedOrder}
        onCancel={() => setOpenDetailModal(false)}
        onUpdate={() => {
          fetchMyOrders(); // Refresh lại list nếu có thay đổi
        }}
        readOnly={true}
      />
    </>
  );
};

export default OrderListTable;
