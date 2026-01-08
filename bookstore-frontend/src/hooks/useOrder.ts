import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type {
  CreateOrderRequest,
  OrderResponse,
  DashboardStats,
  Order,
  PageableParams,
  PagedResponse,
} from '@/constants/interfaces';
import { useCallback, useState } from 'react';

export const useOrder = () => {
  const [isCreating, setIsCreating] = useState(false);
  // Thêm state loading cho việc update
  const [isUpdating, setIsUpdating] = useState(false);

  const getAllOrders = useCallback(async (params?: PageableParams) => {
    const response = await Request.get<PagedResponse<Order>>(
      API_ENDPOINTS.ORDERS,
      { params },
    );
    return response;
  }, []);

  // --- TẠO ĐƠN HÀNG ---
  const createOrder = useCallback(async (orderData: CreateOrderRequest) => {
    setIsCreating(true);
    try {
      const response = await Request.post<OrderResponse>(
        API_ENDPOINTS.ORDERS,
        orderData,
      );
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // --- CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (MỚI BỔ SUNG) ---
  const updateOrder = useCallback(
    async (id: number, data: { status: string }) => {
      setIsUpdating(true);
      try {
        // Backend Endpoint: PUT /api/v1/orders/admin/{id}/status
        // API_ENDPOINTS.ORDERS thường là '/api/v1/orders'
        const response = await Request.put<OrderResponse>(
          `${API_ENDPOINTS.ORDERS}/admin/${id}/status`,
          data,
        );
        return response;
      } catch (error: any) {
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const getDashboardStats = useCallback(async () => {
    const response = await Request.get<DashboardStats>(
      `${API_ENDPOINTS.ORDER_STATS}`,
    );
    return response;
  }, []);

  return {
    getAllOrders,
    createOrder,
    updateOrder, // Export hàm này ra để Modal sử dụng
    getDashboardStats,
    isCreating,
    isUpdating, // Export state này để disable nút khi đang lưu
  };
};
