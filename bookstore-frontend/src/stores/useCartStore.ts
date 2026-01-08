import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { CartItem } from '@/constants/interfaces';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

interface CartActions {
  setCart: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  // Các action UI update (Optimistic update)
  updateItemQuantityLocal: (productId: number, quantity: number) => void;
  removeItemLocal: (productId: number) => void;
  toggleItemSelection: (productId: number) => void;
  toggleAllSelection: () => void;
  clearCartLocal: () => void;
}

export const useCartStore = create<CartState & CartActions>()(
  immer((set) => ({
    items: [],
    isLoading: false,

    setLoading: (loading) => set({ isLoading: loading }),

    // Action này dùng để sync data từ Backend vào Store
    setCart: (newItems) =>
      set((state) => {
        // Giữ lại trạng thái selected của user nếu item đã tồn tại
        const mergedItems = newItems.map((newItem) => {
          const existingItem = state.items.find(
            (i) => i.productId === newItem.productId,
          );
          return {
            ...newItem,
            selected: existingItem ? existingItem.selected : true, // Mặc định chọn nếu mới
          };
        });
        state.items = mergedItems;
      }),

    updateItemQuantityLocal: (productId, quantity) =>
      set((state) => {
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.quantity = quantity;
      }),

    removeItemLocal: (productId) =>
      set((state) => {
        state.items = state.items.filter((i) => i.productId !== productId);
      }),

    clearCartLocal: () =>
      set((state) => {
        state.items = [];
      }),

    toggleItemSelection: (productId) =>
      set((state) => {
        const item = state.items.find((i) => i.productId === productId);
        if (item) item.selected = !item.selected;
      }),

    toggleAllSelection: () =>
      set((state) => {
        const allSelected =
          state.items.length > 0 && state.items.every((i) => i.selected);
        state.items.forEach((i) => {
          i.selected = !allSelected;
        });
      }),
  })),
);
