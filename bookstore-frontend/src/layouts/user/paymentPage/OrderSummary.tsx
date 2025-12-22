// layouts/user/payment_page/DeliveryMethod.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CartItem, CustomErrorResponse } from '@/constants/interfaces.ts';
import { useCart } from '@/hooks/useCart.ts';
import { Button } from '@/components/ui/button.tsx';
import { useOrder } from '@/hooks/useOrder.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { toast } from 'sonner';
import { formattedPrice } from '@/utils/priceHelper';
import { useBook } from '@/hooks/useBook';

export default function DeliveryMethod() {
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState<number>(0);

  const isCalculating = useRef(false);
  const bookDataRef = useRef<Map<number, any>>(new Map());
  const fetchedItems = useRef<Set<number>>(new Set());

  const { getBookById } = useBook();
  const { createOrders } = useOrder();
  const { user } = useAuth();
  const { cartItems, removeFromCart } = useCart();

  const selectedItems = useMemo(() => {
    if (location.state?.selectedCartItems) {
      return location.state.selectedCartItems;
    }
    if (location.state?.bookId) {
      return [
        {
          productId: location.state.bookId,
          quantity: location.state.quantity || 1,
        },
      ];
    }
    return cartItems;
  }, [location.state, cartItems]);

  const calculateTotal = useCallback(async () => {
    if (!selectedItems || selectedItems.length === 0) {
      setTotal(0);
      return;
    }

    // Prevent multiple simultaneous calculations
    if (isCalculating.current) {
      return;
    }

    isCalculating.current = true;

    try {
      const totalPrice = await Promise.all(
        selectedItems.map(async (item: any) => {
          if (!item.productId) return 0;

          // Check if we already have the book data in ref
          if (bookDataRef.current.has(item.productId)) {
            const cachedBook = bookDataRef.current.get(item.productId);
            return cachedBook.listPrice * (item.quantity || 1);
          }

          // Check if we've already fetched this item in this session
          if (fetchedItems.current.has(item.productId)) {
            // Get cached data from useBook hook instead of returning 0
            const cachedData = await getBookById(item.productId);
            return cachedData.listPrice * (item.quantity || 1);
          }

          const data = await getBookById(item.productId);
          fetchedItems.current.add(item.productId);

          // Store the book data in ref for future use
          bookDataRef.current.set(item.productId, data);

          return data.listPrice * (item.quantity || 1);
        }),
      );

      const sum = totalPrice.reduce((acc, price) => acc + (price || 0), 0);
      setTotal(sum);
    } catch (error) {
      console.error('OrderSummary: Error calculating total:', error);
      setTotal(0);
    } finally {
      isCalculating.current = false;
    }
  }, [selectedItems]); // Remove bookData from dependencies

  const onClick = useCallback(async () => {
    if (!user?.fullName || !user?.address || !user?.phone) {
      toast.error('Chưa có đầy đủ thông tin khách hàng để giao hàng');
      return;
    }

    try {
      if (location.state?.selectedCartItems) {
        const selectedItems = location.state.selectedCartItems;
        const data = selectedItems
          .filter((item: any) => item.productId !== undefined)
          .map((item: any) => ({
            productId: item.productId || 0,
            quantity: item.quantity || 1,
          }));

        await createOrders(data);
      } else if (location.state?.bookId) {
        await createOrders([
          {
            productId: location.state.bookId,
            quantity: location.state.quantity || 1,
          },
        ]);
      } else if (cartItems.length > 0) {
        const data = cartItems
          .filter((item): item is CartItem => item.productId !== undefined)
          .map((item) => ({
            productId: item.productId || 0,
            quantity: item.quantity || 1,
          }));

        await createOrders(data);
      }
    } catch (e: unknown) {
      const axiosError = e as CustomErrorResponse;
      console.error(axiosError.data?.message || 'Có lỗi xảy ra');
      toast.error(axiosError.data?.message || 'Lưu đơn hàng thất bại');
      return;
    }
    toast.success('Lưu đơn hàng thành công');

    // Xóa các sản phẩm đã đặt hàng thành công
    if (location.state?.selectedCartItems) {
      location.state.selectedCartItems.forEach((item: CartItem) => {
        if (item.productId) {
          removeFromCart(item.productId);
        }
      });
    } else if (location.state?.bookId) {
      // Nếu là mua ngay, xóa sản phẩm tương ứng
      const bookItem: CartItem = {
        productId: location.state.bookId,
        quantity: location.state.quantity || 1,
        name: '',
        thumbnailUrl: '',
        price: 0,
        originalPrice: 0,
      };
      removeFromCart(bookItem.productId);
    } else if (cartItems.length > 0) {
      // Nếu không có state, xóa toàn bộ giỏ hàng (fallback)
      cartItems.map((item) => removeFromCart(item.productId));
    }

    navigate('/confirm');
  }, [
    location.state,
    cartItems,
    createOrders,
    removeFromCart,
    navigate,
    toast,
  ]);

  useEffect(() => {
    // Reset fetched items when selectedItems change
    fetchedItems.current.clear();
    // Clear bookData when selectedItems change to force fresh fetch
    bookDataRef.current.clear();
    // Force recalculation only when selectedItems actually change
    if (selectedItems.length > 0) {
      calculateTotal();
    }
  }, [selectedItems]); // Only depend on selectedItems

  const shippingFee = useMemo(() => 25000, []);
  const discount = useMemo(() => 25000, []);
  const finalTotal = useMemo(() => total, [total]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Chi tiết giá */}
        <div className="py-3 space-y-2 text-sm border-t border-b border-gray-200">
          <div className="flex justify-between text-gray-600">
            <span>Tổng tiền hàng</span>
            <span>{formattedPrice(finalTotal)}đ</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{formattedPrice(shippingFee)}đ</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Giảm giá trực tiếp</span>
            <span>0đ</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="flex items-center">
              Giảm giá vận chuyển
              <span className="ml-1 text-gray-400">ⓘ</span>
            </span>
            <span>-{formattedPrice(discount)}đ</span>
          </div>
        </div>

        {/* Tổng tiền thanh toán */}
        <div className="py-3">
          <div className="flex justify-between items-end">
            <span className="font-semibold text-base">
              Tổng tiền thanh toán
            </span>
            <span className="text-red-500 font-semibold text-lg">
              {formattedPrice(finalTotal - shippingFee)} đ
            </span>
          </div>
          <p className="text-green-600 text-sm mt-0.5 text-right">
            Tiết kiệm {formattedPrice(discount)} đ
          </p>
          <p className="text-gray-400 text-xs mt-1 text-right">
            (Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các
            chi phí phát sinh khác)
          </p>
        </div>

        {/* Nút đặt hàng */}
        <div className="pb-4">
          <Button
            onClick={onClick}
            className="w-full h-11 bg-red-500 text-white font-semibold rounded"
          >
            Đặt hàng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
