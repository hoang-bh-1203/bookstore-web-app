import { toast } from 'sonner';
import type { CartItem, CartValidateResponse } from '@/constants/interfaces';
import Request from '@/configs/api.ts';
import { API_ENDPOINTS } from '@/constants/endpoint.ts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useCallback } from 'react';

export const useCart = () => {
  // 1. Use stable selectors - only select what you need
  const cartItems = useCartStore((state) => state.items);
  const storeAddToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // 2. Get auth state with stable selector
  const isAuthenticated = useAuthStore((state) => !!state.token);

  // 3. Wrap addToCart with useCallback to prevent recreation
  const addToCart = useCallback(
    (item: CartItem): boolean => {
      if (!isAuthenticated) {
        toast.warning('Yêu cầu đăng nhập', {
          description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
          duration: 4000,
        });
        return false;
      }

      // Validate/normalize (nếu cần)
      const normalizedItem: CartItem = {
        productId: item.productId || 0,
        name: item.name || 'Unnamed Product',
        thumbnailUrl: item.thumbnailUrl || '/placeholder.svg',
        price: item.price || 0,
        originalPrice: item.originalPrice || 0,
        quantity: item.quantity || 1,
      };

      storeAddToCart(normalizedItem); // Gọi action của store
      return true;
    },
    [isAuthenticated, storeAddToCart],
  );

  // 5. Use useMemo for derived state to prevent recalculation
  const getTotalItems = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total: number, item: CartItem) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  // 6. Giữ lại logic API (không liên quan state)
  const validateCart = useCallback(async (selectedCartItems: CartItem[]) => {
    return await Request.post<CartValidateResponse>(
      API_ENDPOINTS.VALIDATE_CART,
      selectedCartItems,
    );
  }, []);

  // 8. Return stable references
  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isAuthenticated,
    validateCart,
  };
};
