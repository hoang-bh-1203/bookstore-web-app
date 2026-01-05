import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { Eye, Search, X } from 'lucide-react';

import AdminTable, {
  type CustomTableColumn,
} from '@/components/common/custom-table';
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
import ModalDetailOrder from '../modals/modal-detail-order';

import type {
  Order,
  PageableParams,
  PagedResponse,
} from '@/constants/interfaces';
import { OrderStatus, OrderStatusLabel } from '@/constants/enums';
import { useOrder } from '@/hooks/useOrder';

// --- 1. Column Definitions ---
const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = 'bg-gray-500 hover:bg-gray-600';
  switch (status) {
    case OrderStatus.CONFIRMED:
      colorClass = 'bg-blue-500 hover:bg-blue-600';
      break;
    case OrderStatus.DELIVERED:
      colorClass = 'bg-orange-500 hover:bg-orange-600';
      break;
    case OrderStatus.COMPLETED:
      colorClass = 'bg-green-600 hover:bg-green-700';
      break;
    case OrderStatus.CANCELLED:
      colorClass = 'bg-red-500 hover:bg-red-600';
      break;
    case OrderStatus.PENDING:
      colorClass = 'bg-yellow-500 hover:bg-yellow-600';
      break;
  }
  return (
    <Badge className={`${colorClass} text-white capitalize border-none`}>
      {OrderStatusLabel[status as keyof typeof OrderStatusLabel] || status}
    </Badge>
  );
};

// --- 2. Main Component ---
const OrderManagementTable = () => {
  // Init Data from Loader
  const defaultOrders = useLoaderData() as PagedResponse<Order>;

  // Hooks
  const { getAllOrders } = useOrder();

  // States: Data & Pagination
  const [orders, setOrders] = useState<Order[]>(defaultOrders.data || []);
  const [pagination, setPagination] = useState({
    page: defaultOrders.currentPage + 1 || 1, // API trả về 0-based, UI dùng 1-based
    size: defaultOrders.pageSize || 10,
    total: defaultOrders.totalElements || 0,
  });
  const [loading, setLoading] = useState(false);

  // States: Filters & Sorter
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});

  // States: Modal
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Handlers: Fetch Data ---
  const fetchOrders = useCallback(
    async (params: PageableParams) => {
      setLoading(true);
      try {
        // Backend Spring Boot trang bắt đầu từ 0, UI bắt đầu từ 1 => trừ 1
        const pageParam = (params.page || 1) - 1;

        const response = await getAllOrders({
          ...params,
          page: pageParam < 0 ? 0 : pageParam,
        });

        setOrders(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.totalElements,
          // Cập nhật lại page/size từ response để đồng bộ
          page: response.currentPage + 1,
          size: response.pageSize,
        }));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Tải danh sách đơn hàng thất bại');
      } finally {
        setLoading(false);
      }
    },
    [getAllOrders],
  );

  // --- Handlers: Debounce & Effect ---
  const debouncedFetchOrders = useMemo(
    () => debounce(fetchOrders, 500),
    [fetchOrders],
  );

  useEffect(() => {
    const params: PageableParams = {
      page: pagination.page,
      size: pagination.size,
    };

    if (sorter.field && sorter.order) {
      params.sort = `${sorter.field},${sorter.order}`;
    } else {
      params.sort = 'id,desc'; // Default sort
    }

    if (keyword) params.keyword = keyword;

    // Ép kiểu statusFilter vì PageableParams trong interface của bạn chưa có field status
    // Bạn cần update interface PageableParams thêm field status?: string
    if (statusFilter && statusFilter !== 'ALL') {
      (params as any).status = statusFilter;
    }

    debouncedFetchOrders(params);

    return () => {
      debouncedFetchOrders.cancel();
    };
  }, [
    pagination.page,
    pagination.size,
    sorter,
    keyword,
    statusFilter,
    debouncedFetchOrders,
  ]);

  // --- Handlers: Actions ---
  const handleDetail = useCallback((order: Order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  }, []);

  const handleRefresh = () => {
    // Gọi lại fetch với state hiện tại để refresh data sau khi update status
    const params: PageableParams = {
      page: pagination.page,
      size: pagination.size,
      keyword,
      sort:
        sorter.field && sorter.order
          ? `${sorter.field},${sorter.order}`
          : 'id,desc',
    };
    if (statusFilter && statusFilter !== 'ALL')
      (params as any).status = statusFilter;
    fetchOrders(params);
  };

  // Define Columns inside component to use handleDetail
  const columns: CustomTableColumn<Order>[] = [
    { key: 'id', title: 'ID', dataIndex: 'id', width: 80, align: 'center' },
    { key: 'customerName', title: 'Khách hàng', dataIndex: 'customerName' },
    {
      key: 'totalAmount',
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      align: 'right',
      render: (value) => (
        <span className="font-semibold">
          {Number(value).toLocaleString()} đ
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
      key: 'actions',
      title: 'Thao tác',
      dataIndex: 'id',
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

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="flex px-6 py-4 justify-between items-center border-b">
          <h3 className="text-lg font-semibold text-foreground">
            Quản lý đơn hàng
          </h3>
          {/* Orders thường không có nút tạo thủ công ở đây, nếu cần thì thêm vào */}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 p-6 border-b">
          {/* Search */}
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên khách hàng..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="pl-8"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter || undefined}
            onValueChange={(value) => {
              setStatusFilter(value === 'ALL' ? null : value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              {Object.entries(OrderStatus).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {OrderStatusLabel[key as keyof typeof OrderStatusLabel]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sorter */}
          <Select
            value={sorter.order}
            onValueChange={
              (value) =>
                setSorter((prev) => ({
                  ...prev,
                  order: value,
                  field: 'totalAmount',
                })) // Mặc định sort theo totalAmount nếu chọn order
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp tiền" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Thấp đến cao</SelectItem>
              <SelectItem value="desc">Cao đến thấp</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filter */}
          {(keyword || statusFilter || sorter.order) && (
            <Button
              variant="outline"
              onClick={() => {
                setKeyword('');
                setStatusFilter(null);
                setSorter({});
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <X className="mr-2 h-4 w-4" /> Bỏ lọc
            </Button>
          )}
        </div>

        {/* Table */}
        <AdminTable<Order>
          data={orders}
          columns={columns}
          loading={loading}
          showActions={false} // Tắt action mặc định vì ta custom cột action riêng
          className="p-0 border-none shadow-none rounded-none"
          pagination={{
            page: pagination.page,
            size: pagination.size,
            total: pagination.total,
          }}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      </div>

      <ModalDetailOrder
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        onCancel={() => setOpenDetailModal(false)}
        open={openDetailModal}
        order={selectedOrder}
        onUpdate={handleRefresh}
      />
    </>
  );
};

export default OrderManagementTable;
