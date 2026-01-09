import { useCallback, useEffect, useMemo } from 'react';
import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type { CartItem, CartResponse } from '@/constants/interfaces';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'sonner';

export const useCart = () => {
  // 1. Lấy State & Actions từ Store
  const {
    items: cartItems,
    isLoading,
    setLoading,
    setCart,
    updateItemQuantityLocal,
    removeItemLocal,
    clearCartLocal,
    toggleItemSelection,
    toggleAllSelection,
  } = useCartStore();

  const isAuthenticated = useAuthStore((state: any) => !!state.accessToken);

  // --- HELPER: Map data từ Backend về Frontend Store ---
  const mapResponseToStore = useCallback(
    (response: CartResponse): CartItem[] => {
      // Kiểm tra nếu response hoặc response.items không tồn tại
      if (!response || !response.items) return [];

      return response.items.map((item) => ({
        id: item.id, // ID của dòng trong giỏ hàng (để xóa/sửa)
        productId: item.productId,
        name: item.productName,
        // Logic giá: Backend trả về giá gốc (productPrice) và % giảm (productDiscount)
        price: item.productPrice * (1 - (item.productDiscount || 0) / 100),
        originalPrice: item.productPrice,
        quantity: item.quantity,
        thumbnailUrl: item.productImage || '/placeholder.svg',
        selected: true,
      }));
    },
    [],
  );

  // --- API FUNCTIONS ---

  // 1. Get Cart (Lấy danh sách)
  const getCart = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await Request.get<any>(API_ENDPOINTS.CART);
      // Xử lý trường hợp response trả về trực tiếp data hoặc bọc trong object
      const cartData: CartResponse = response.data || response;

      if (cartData) {
        const mappedItems = mapResponseToStore(cartData);
        setCart(mappedItems);
      }
      return cartData;
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, setLoading, setCart, mapResponseToStore]);

  // Tự động fetch cart khi hook được mount (nếu đã login)
  // Lưu ý: Header sử dụng useCart nên nó sẽ tự chạy 1 lần ở Header
  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated]); // Bỏ getCart khỏi dependency để tránh loop vô tận nếu không dùng useCallback chuẩn

  // 2. Add to Cart
  const addToCart = useCallback(
    async (productData: { productId: number; quantity: number }) => {
      if (!isAuthenticated) {
        toast.warning('Vui lòng đăng nhập để mua hàng');
        return;
      }
      try {
        await Request.post(API_ENDPOINTS.CART_ITEMS, productData);
        toast.success('Đã thêm vào giỏ hàng');
        await getCart(); // Gọi lại để đồng bộ dữ liệu mới nhất
      } catch (error: any) {
        const msg =
          error?.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng';
        toast.error(msg);
        throw error;
      }
    },
    [isAuthenticated, getCart],
  );

  // 3. Update Quantity
  const updateQuantity = useCallback(
    async (payload: { id: number; quantity: number }) => {
      const currentItem = cartItems.find((i) => i.productId === payload.id);
      if (!currentItem?.id) return;

      const oldQuantity = currentItem.quantity;
      try {
        updateItemQuantityLocal(payload.id, payload.quantity); // Optimistic Update
        await Request.put(API_ENDPOINTS.CART_ITEM_BY_ID(currentItem.id), {
          quantity: payload.quantity,
        });
        // Không cần getCart() lại để tránh giật lag UI khi tăng giảm số lượng liên tục
      } catch (error: any) {
        updateItemQuantityLocal(payload.id, oldQuantity); // Rollback
        toast.error('Không thể cập nhật số lượng');
      }
    },
    [cartItems, updateItemQuantityLocal],
  );

  // 4. Remove Item
  const removeFromCart = useCallback(
    async (productId: number) => {
      const currentItem = cartItems.find((i) => i.productId === productId);
      if (!currentItem?.id) return;

      try {
        removeItemLocal(productId); // Optimistic Update
        await Request.delete(API_ENDPOINTS.CART_ITEM_BY_ID(currentItem.id));
        toast.success('Đã xóa sản phẩm');
      } catch (error) {
        getCart(); // Load lại nếu lỗi
        toast.error('Lỗi khi xóa sản phẩm');
      }
    },
    [cartItems, removeItemLocal, getCart],
  );

  // 5. Clear Cart
  const clearCart = useCallback(async () => {
    try {
      clearCartLocal();
      await Request.delete(API_ENDPOINTS.CART);
      toast.success('Đã xóa giỏ hàng');
    } catch (error) {
      getCart();
      toast.error('Lỗi khi xóa giỏ hàng');
    }
  }, [clearCartLocal, getCart]);

  // --- DERIVED STATE (Tính toán) ---

  // TÍNH TOÁN TOTAL ITEMS (Sửa lỗi cho Header)
  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.selected),
    [cartItems],
  );

  const selectedTotalPrice = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [selectedItems]);

  const allSelected = useMemo(
    () => cartItems.length > 0 && cartItems.every((item) => item.selected),
    [cartItems],
  );

  return {
    cartItems,
    selectedItems,
    totalItems, // Đã thêm cái này để Header dùng
    isLoading,
    isAuthenticated,
    selectedTotalPrice,
    allSelected,
    getCart, // Export hàm này để CartPage gọi chủ động
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleItemSelection,
    toggleAllSelection,
    resetCart: clearCartLocal,
  };
};
