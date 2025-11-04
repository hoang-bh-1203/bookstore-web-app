// src/hooks/useCart.ts (ĐÃ REFACTOR)
import { notification } from 'antd';
import type { CartItem, CartValidateResponse } from '@/constants/interfaces';
import Request from '@/configs/api.ts';
import { API_ENDPOINTS } from '@/constants/endpoint.ts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';

export const useCart = () => {
  // 1. Lấy state và actions từ store
  const {
    items: cartItems,
    addToCart: storeAddToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore((state) => ({
    items: state.items,
    addToCart: state.addToCart,
    updateQuantity: state.updateQuantity,
    removeFromCart: state.removeFromCart,
    clearCart: state.clearCart,
  }));

  // 2. Lấy state auth
  const isAuthenticated = useAuthStore((state) => !!state.token);

  // 3. Xóa BỎ TOÀN BỘ:
  // - useState, useEffect, useRef, handleStorageChange, handleCartUpdated
  // - Toàn bộ logic `localStorage.setItem` và `dispatchEvent`
  // Lý do: `useCartStore` với middleware `persist` đã tự động làm hết việc này.

  // 4. Wrap lại `addToCart` với logic check auth
  const addToCart = (item: CartItem): boolean => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Yêu cầu đăng nhập',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        duration: 4,
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
  };

  // 5. Giữ lại các hàm tính toán (derived state)
  const getTotalItems = () => {
    return cartItems.length;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total: number, item: CartItem) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  // 6. Giữ lại logic API (không liên quan state)
  const validateCart = async (selectedCartItems: CartItem[]) => {
    return await Request.post<CartValidateResponse>(
      API_ENDPOINTS.VALIDATE_CART,
      selectedCartItems,
    );
  };

  // 7. Vấn đề `removeItemsFromCart`:
  //    Logic này CÓ trong hook cũ nhưng KHÔNG CÓ trong Redux slice.
  //    Bạn cần thêm action này vào `useCartStore.ts` để nó hoạt động.
  /*
    // Thêm vào useCartStore.ts:
    removeItemsFromCart: (itemsToRemove) => set((state) => {
      const itemsToRemoveMap = new Map(
        itemsToRemove.map(item => [item.productId, item.quantity])
      );
      state.items = state.items.filter(item => {
         // ... (logic y hệt trong hook cũ) ...
      });
    }),
  */
  // Giả sử đã thêm vào store:
  const removeItemsFromCart = useCartStore(
    (state) => state.removeItemsFromCart,
  );

  // 8. Trả về
  return {
    cartItems,
    addToCart, // <-- hàm wrapper đã check auth
    updateQuantity, // <-- từ store
    removeFromCart, // <-- từ store
    clearCart, // <-- từ store
    removeItemsFromCart, // <-- từ store (sau khi bạn thêm vào)
    getTotalItems,
    getTotalPrice,
    isAuthenticated,
    validateCart,
  };
};
