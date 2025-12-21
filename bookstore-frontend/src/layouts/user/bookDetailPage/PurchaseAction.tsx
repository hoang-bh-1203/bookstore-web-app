// layouts/user/book_detail_page/PurchaseActions.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Book } from '@/constants/interfaces.ts';
import { useState } from 'react';
import { formattedPrice } from '@/utils/priceHelper.ts';
import { useNavigate } from 'react-router';
import { useModal } from '@/hooks/useModal.ts';
import Counter from './Counter.tsx';
import { useCart } from '@/hooks/useCart.ts';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface PurchaseActionsProps {
  book: Book | undefined;
}

export default function PurchaseActions({ book }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const totalPrice = book ? book.listPrice * quantity : 0;
  const navigate = useNavigate();
  const { openLoginModal } = useModal();
  const { addToCart, cartItems } = useCart();

  const onClickBuyNow = () => {
    if (!addToCart) {
      openLoginModal();
      return;
    }

    navigate('/payment', {
      state: { bookId: book?.id, quantity: quantity },
    });
  };

  const onClickAddToCart = () => {
    if (!addToCart) {
      openLoginModal();
      return;
    }

    if (!book?.id) return;
    const exists = cartItems.some((item) => item.productId === book.id);

    if (exists) {
      // 3. Gọi toast.error()
      toast.error('Sản phẩm này đã có trong giỏ hàng!');
      return;
    }

    const success = addToCart({
      productId: book.id,
      name: book.name,
      thumbnailUrl: book.images[0].thumbnailUrl,
      price: book.listPrice,
      originalPrice: book.originalPrice,
      quantity: quantity,
    });

    if (success) {
      // 4. Gọi toast.success()
      toast.success('Thêm sản phẩm vào giỏ hàng thành công');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="hidden lg:flex items-center gap-2">
          <img
            src="/src/assets/tiki-logo.svg"
            alt="ai"
            style={{ width: 40, height: 40 }}
          />
          <div>
            <div className="font-medium">BS Trading</div>
            <img
              src="/src/assets/offical.svg"
              alt="ai"
              style={{ height: 20 }}
            />
          </div>
        </div>

        <Separator className="my-4 hidden lg:flex" />

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
          <Button
            variant="outline"
            size="lg"
            className="w-full text-primary border-primary hover:text-primary"
          >
            Mua trước trả sau
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
