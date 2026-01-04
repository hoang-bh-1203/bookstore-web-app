// src/hooks/useOrder.ts (ĐÃ REFACTOR)
import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type {
  CreateOrderResponse,
  DashboardStats,
  Order,
  OrderCreate,
  PageableParams,
  PagedResponse,
} from '@/constants/interfaces';
import { useCartStore } from '@/stores/useCartStore';
import { useCallback } from 'react';

export const useOrder = () => {
  // 2. Lấy action 'setRecentOrder' trực tiếp từ store
  // Hook này sẽ subscribe vào action, an toàn về hiệu suất
  const setRecentOrder = useCartStore((state) => state.setRecentOrder);

  const getAllOrders = useCallback(async (params?: PageableParams) => {
    const response = await Request.get<PagedResponse<Order>>(
      API_ENDPOINTS.ORDERS,
      { params },
    );
    return response;
  }, []);

  const updateOrder = useCallback(
    async (id: number, orderData: Partial<Order>) => {
      const response = await Request.put<Order>(
        API_ENDPOINTS.ORDER_BY_ID(id),
        orderData,
      );
      return response;
    },
    [],
  );

  const createOrders = useCallback(
    async (ordersData: Partial<OrderCreate[]>) => {
      const response = await Request.post<CreateOrderResponse>(
        API_ENDPOINTS.ORDERS_CREATE,
        ordersData,
      );

      // 3. Gọi action trực tiếp, không cần dispatch
      setRecentOrder(response);
      return response;
    },
    [],
  );

  const getDashboardStats = useCallback(async () => {
    // Gọi endpoint /api/v1/orders/stats
    const response = await Request.get<DashboardStats>(
      `${API_ENDPOINTS.ORDERS_STAT}`,
    );
    return response;
  }, []);

  return { getAllOrders, updateOrder, createOrders, getDashboardStats };
};
