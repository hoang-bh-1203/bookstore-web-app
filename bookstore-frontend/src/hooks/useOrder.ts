// src/hooks/useOrder.ts (ĐÃ REFACTOR)
import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type {
  CreateOrderResponse,
  Order,
  OrderCreate,
} from '@/constants/interfaces';
import { useCartStore } from '@/stores/useCartStore';

export const useOrder = () => {
  // 2. Lấy action 'setRecentOrder' trực tiếp từ store
  // Hook này sẽ subscribe vào action, an toàn về hiệu suất
  const setRecentOrder = useCartStore((state) => state.setRecentOrder);

  const getAllOrders = async () => {
    const response = await Request.get<Order[]>(API_ENDPOINTS.ORDERS);
    return response;
  };

  const updateOrder = async (id: number, orderData: Partial<Order>) => {
    const response = await Request.put<Order>(
      API_ENDPOINTS.ORDER_BY_ID(id),
      orderData,
    );
    return response;
  };

  const createOrders = async (ordersData: Partial<OrderCreate[]>) => {
    const response = await Request.post<CreateOrderResponse>(
      API_ENDPOINTS.ORDERS_CREATE,
      ordersData,
    );

    // 3. Gọi action trực tiếp, không cần dispatch
    setRecentOrder(response);
    return response;
  };

  return { getAllOrders, updateOrder, createOrders };
};
