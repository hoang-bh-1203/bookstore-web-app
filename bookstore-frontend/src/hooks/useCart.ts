import { toast } from 'sonner';
import type { CartItem, CartValidateResponse } from '@/constants/interfaces';
import Request from '@/configs/api.ts';
import { API_ENDPOINTS } from '@/constants/endpoint.ts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCallback, useMemo } from 'react';

export const useCart = () => {
  // 1. Select state and actions
  const cartItems = useCartStore((state) => state.items);
  const storeAddToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const toggleItemSelection = useCartStore(
    (state) => state.toggleItemSelection,
  );
  const toggleAllSelection = useCartStore((state) => state.toggleAllSelection);
  const clearCart = useCartStore((state) => state.clearCart);

  // 2. Auth state
  const isAuthenticated = useAuthStore((state) => !!(state as any).token);

  // 3. Wrapper addToCart with Auth check
  const addToCart = useCallback(
    (item: CartItem): boolean => {
      if (!isAuthenticated) {
        toast.warning('Yêu cầu đăng nhập', {
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
          duration: 4000,
        });
        return false;
      }

      const normalizedItem: CartItem = {
        productId: item.productId || 0,
        name: item.name || 'Unnamed Product',
        thumbnailUrl: item.thumbnailUrl || '/placeholder.svg',
        price: item.price || 0,
        originalPrice: item.originalPrice || 0,
        quantity: item.quantity || 1,
        selected: true, // Mặc định chọn khi thêm
      };

      storeAddToCart(normalizedItem);
      toast.success('Đã thêm vào giỏ hàng'); // Thêm toast success nếu cần
      return true;
    },
    [isAuthenticated, storeAddToCart],
  );

  // 4. Validate API logic
  const validateCart = useCallback(async (selectedCartItems: CartItem[]) => {
    return await Request.post<CartValidateResponse>(
      API_ENDPOINTS.VALIDATE_CART,
      selectedCartItems,
    );
  }, []);

  // --- DERIVED STATE (Tính toán dựa trên cartItems) ---

  // Tổng số lượng items (không quan tâm selected)
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cartItems]);

  // Tổng tiền của TOÀN BỘ giỏ hàng
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0,
    );
  }, [cartItems]);

  // Danh sách các item ĐƯỢC CHỌN
  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => item.selected);
  }, [cartItems]);

  // Tổng tiền của các item ĐƯỢC CHỌN (Dùng để hiển thị ở nút Thanh Toán)
  const selectedTotalPrice = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0,
    );
  }, [selectedItems]);

  // Kiểm tra xem có phải tất cả đều được chọn không
  const allSelected = useMemo(() => {
    return cartItems.length > 0 && cartItems.every((item) => item.selected);
  }, [cartItems]);

  return {
    // Data
    cartItems,
    selectedItems,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleItemSelection,
    toggleAllSelection,
    validateCart,

    // Derived Values
    totalItems,
    totalPrice, // Tổng tất cả
    selectedTotalPrice, // Tổng tiền thanh toán
    allSelected, // Trạng thái checkbox "Chọn tất cả"
    isAuthenticated,
  };
};
