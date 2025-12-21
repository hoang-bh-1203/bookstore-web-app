/**
 * Shopping cart store using Zustand with Immer
 * Manages cart items and recent order information with persistent storage
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer'; // Use Immer for safe state mutations
import type { CartItem, CreateOrderResponse } from '@/constants/interfaces';
import { formattedPrice } from '@/utils/priceHelper';
import { randomDeliveryDate } from '@/utils/dateHelper';

/**
 * Cart state interface
 */
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

/**
 * Cart actions interface
 */
interface CartActions {
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (payload: { id: number; quantity: number }) => void;
  clearCart: () => void;
  setRecentOrder: (order: CreateOrderResponse) => void;
  clearRecentOrder: () => void;
}

/**
 * Initial cart state
 */
const initialState: CartState = {
  items: [], // Will be hydrated from localStorage by persist middleware
  recentOrder: null,
};

/**
 * Create cart store with Immer and persistence
 * Immer middleware must be wrapped inside persist middleware
 */
export const useCartStore = create<CartState & CartActions>()(
  persist(
    // Immer allows direct state mutations (like Redux Toolkit)
    // e.g., state.items.push() instead of returning new arrays
    immer((set) => ({
      ...initialState,

      /**
       * All reducer logic goes here
       * Note: No manual localStorage.setItem calls needed
       * Persist middleware handles storage automatically after each state change
       */

      addToCart: (newItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (item: any) => item.productId === newItem.productId,
          );
          if (existingItem) {
            existingItem.quantity += newItem.quantity;
          } else {
            state.items.push(newItem);
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

      clearCart: () =>
        set((state) => {
          state.items = [];
        }),

      // Manage recent order information
      setRecentOrder: (payload) =>
        set((state) => {
          if (!payload || !payload.orderId) {
            console.error('Invalid order data:', payload);
            return;
          }
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
      name: 'cart-storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist cart items, not recentOrder
    },
  ),
);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setRecentOrder,
  clearRecentOrder,
} = useCartStore.getState();
