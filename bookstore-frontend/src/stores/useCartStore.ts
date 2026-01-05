import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartItem, CreateOrderResponse } from '@/constants/interfaces';
import { formattedPrice } from '@/utils/priceHelper';
import { randomDeliveryDate } from '@/utils/dateHelper';

interface CartState {
  items: CartItem[];
  recentOrder: {
    totalAmount: string;
    orderId: number;
    productId: number;
    productName: string;
    thumbnailUrl: string;
    deliveryDate: string;
  } | null;
}

interface CartActions {
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (payload: { id: number; quantity: number }) => void;

  // --- NEW: Selection Actions ---
  toggleItemSelection: (productId: number) => void;
  toggleAllSelection: () => void;

  clearCart: () => void;
  setRecentOrder: (order: CreateOrderResponse) => void;
  clearRecentOrder: () => void;
}

const initialState: CartState = {
  items: [],
  recentOrder: null,
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    immer((set) => ({
      ...initialState,

      addToCart: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item: any) => item.productId === newItem.productId,
          );
          if (existingItem) {
            existingItem.quantity += newItem.quantity;
            // Tùy chọn: Khi thêm lại sản phẩm đã có, có muốn tự động select nó không?
            // existingItem.selected = true;
          } else {
            // Mặc định khi thêm mới là selected = true
            state.items.push({ ...newItem, selected: true });
          }
        }),

      removeFromCart: (productId) =>
        set((state) => {
          state.items = state.items.filter(
            (item: any) => item.productId !== productId,
          );
        }),

      updateQuantity: (payload) =>
        set((state) => {
          const item = state.items.find((i: any) => i.productId === payload.id);
          if (item) {
            item.quantity = payload.quantity;
          }
        }),

      // --- NEW: Logic Toggle 1 Item ---
      toggleItemSelection: (productId) =>
        set((state) => {
          const item = state.items.find((i: any) => i.productId === productId);
          if (item) {
            item.selected = !item.selected;
          }
        }),

      // --- NEW: Logic Toggle All ---
      toggleAllSelection: () =>
        set((state) => {
          // Kiểm tra xem tất cả có đang được chọn không (bỏ qua giỏ hàng rỗng)
          const allCurrentlySelected =
            state.items.length > 0 && state.items.every((i: any) => i.selected);

          // Nếu tất cả đang chọn -> bỏ chọn tất cả. Ngược lại -> chọn tất cả
          state.items.forEach((i: any) => {
            i.selected = !allCurrentlySelected;
          });
        }),

      clearCart: () =>
        set((state) => {
          state.items = [];
        }),

      setRecentOrder: (payload) =>
        set((state) => {
          if (!payload || !payload.orderId) return;
          const price = formattedPrice(payload.totalAmount);
          state.recentOrder = {
            totalAmount: price,
            orderId: payload.orderId,
            productId: payload.products?.[0]?.productId,
            productName: payload.products?.[0]?.productName,
            thumbnailUrl: payload.products?.[0]?.thumbnailUrl,
            deliveryDate: randomDeliveryDate(),
          };
        }),

      clearRecentOrder: () =>
        set((state) => {
          state.recentOrder = null;
        }),
    })),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
