// layouts/user/book_detail_page/PurchaseActions.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Book } from '@/constants/interfaces.ts';
import { useCart } from '@/hooks/useCart.ts';
import { useModal } from '@/hooks/useModal.ts';
import { formattedPrice } from '@/utils/priceHelper.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import Counter from './Counter.tsx';

interface PurchaseActionsProps {
  book: Book | undefined;
}

export default function PurchaseActions({ book }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const totalPrice = book ? book.price * quantity : 0;
  const navigate = useNavigate();
  const { openLoginModal } = useModal();
  const { addToCart, cartItems, isAuthenticated } = useCart();

  const checkAuth = () => {
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để mua hàng');
      openLoginModal();
      return false;
    }
    return true;
  };

  const onClickBuyNow = () => {
    // 2. Kiểm tra Auth khi bấm nút
    if (!checkAuth()) return;

    if (!book?.id) return;

    // Chuyển sang trang confirm (Check lại xem trang confirm có cần logic add to cart trước không)
    navigate('/confirm', {
      state: {
        selectedCartItems: [
          {
            productId: book.id,
            name: book.name,
            price: book.price,
            quantity: quantity,
            thumbnailUrl: book.images?.[0]?.imageUrl,
          },
        ],
      },
    });
  };

  const onClickAddToCart = async () => {
    // 3. Kiểm tra Auth khi bấm nút
    if (!checkAuth()) return;

    if (!book?.id) return;

    // Kiểm tra trùng lặp (Optional: Backend thường xử lý cộng dồn, nhưng check ở FE cũng tốt cho UX)
    const exists = cartItems.some((item) => item.productId === book.id);
    if (exists) {
      toast.error('Sản phẩm này đã có trong giỏ hàng!');
      return;
    }

    // 4. Gọi addToCart theo cấu trúc mới của useCart hook
    // (Hook mới đã tự xử lý toast success/error và loading)
    await addToCart({
      productId: book.id,
      quantity: quantity,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-8 lg:flex-col lg:gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold mb-0">Số lượng</p>
            <Counter min={1} onChange={setQuantity} />
          </div>
          <div className="mb-4">
            <span className="block font-semibold">Tạm tính</span>
            <span className="text-2xl font-semibold">
              {formattedPrice(totalPrice)}
              <sup>₫</sup>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={onClickBuyNow}
          >
            Mua ngay
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full text-primary border-primary hover:text-primary"
            onClick={onClickAddToCart}
          >
            Thêm vào giỏ
          </Button>
          {/* <Button
            variant="outline"
            size="lg"
            className="w-full text-primary border-primary hover:text-primary"
          >
            Mua trước trả sau
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
