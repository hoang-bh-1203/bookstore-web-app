// layouts/user/payment_page/DeliveryMethod.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formattedPrice } from '@/utils/priceHelper.ts';
import BookPaymentCard from './BookPaymentCard.tsx';
import { ChevronRight, Package, Info, Truck, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Book } from '@/constants/interfaces.ts';
import { useBook } from '@/hooks/useBook.ts';
import { useCart } from '@/hooks/useCart.ts';
import { Separator } from '@/components/ui/separator';

interface BookSold {
  book: Book;
  quantity: number;
}

export default function DeliveryMethod() {
  const location = useLocation();
  const { getBookById } = useBook();
  const [bookCart, setBookCart] = useState<BookSold[]>([]);
  const [deliveryType, setDeliveryType] = useState<'fast' | 'save'>('fast');
  const { cartItems } = useCart();

  // Giữ nguyên logic useEffect fetch data
  useEffect(() => {
    if (location.state?.selectedCartItems) {
      (async () => {
        const selectedItems = location.state.selectedCartItems;
        const books = await Promise.all(
          selectedItems.map(async (item: any) => {
            if (!item.productId) return;
            const data = await getBookById(item.productId);
            return { book: data, quantity: item.quantity || 1 };
          }),
        );
        setBookCart(books.filter((b): b is BookSold => b !== undefined));
      })();
      return;
    }
    if (location.state?.bookId) {
      (async () => {
        const data = await getBookById(location.state.bookId);
        setBookCart([{ book: data, quantity: location.state.quantity || 1 }]);
      })();
      return;
    }
    if (cartItems.length === 0) {
      setBookCart([]);
      return;
    }
    (async () => {
      const books = await Promise.all(
        cartItems.map(async (item) => {
          if (!item.productId) return;
          const data = await getBookById(item.productId || 0);
          return { book: data, quantity: item.quantity || 1 };
        }),
      );
      setBookCart(books.filter((b): b is BookSold => b !== undefined));
    })();
  }, [location.state, cartItems, getBookById]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Chọn hình thức giao hàng</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Radio chọn phương thức */}
        <div className="relative bg-blue-50/50 border border-blue-200 rounded-lg p-4 w-full md:w-3/4">
          <div className="absolute -bottom-[6px] left-8 w-3 h-3 bg-blue-50/50 border-b border-r border-blue-200 rotate-45"></div>

          <RadioGroup
            value={deliveryType}
            onValueChange={(v) => setDeliveryType(v as 'fast' | 'save')}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fast" id="fast" />
              <Label
                htmlFor="fast"
                className="flex items-center font-normal cursor-pointer"
              >
                <Zap
                  className="h-4 w-4 mr-2 text-yellow-500"
                  fill="currentColor"
                />
                <span>Giao siêu tốc 2h</span>
                <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-1.5 rounded">
                  -25K
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="save" id="save" />
              <Label
                htmlFor="save"
                className="flex items-center font-normal cursor-pointer"
              >
                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Giao tiết kiệm</span>
                <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-1.5 rounded">
                  -16K
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Chi tiết gói giao hàng */}
        <div className="border rounded-xl p-4 pt-6 relative mt-2">
          <div className="absolute -top-3 left-4 bg-background px-2 flex items-center text-sm font-medium text-green-600">
            <Package className="h-4 w-4 mr-2" />
            Gói:{' '}
            {deliveryType === 'fast' ? 'Giao siêu tốc 2h' : 'Giao tiết kiệm'}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm font-medium">
              {deliveryType === 'fast' ? (
                <>
                  <Zap
                    className="h-4 w-4 mr-2 text-yellow-500"
                    fill="currentColor"
                  />{' '}
                  Giao siêu tốc 2H
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" /> Giao tiết kiệm
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground line-through">
                {formattedPrice(deliveryType === 'fast' ? 25000 : 16000)} ₫
              </span>
              <span className="text-sm font-medium text-green-600">
                MIỄN PHÍ
              </span>
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>

          {/* Danh sách sách */}
          <div className="flex flex-col">
            {bookCart.map((item, index) => (
              <BookPaymentCard
                key={item.book.id || index}
                book={item.book}
                quantity={item.quantity}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Mã khuyến mãi shop */}
        <div className="flex items-center text-sm cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors">
          <Package className="h-4 w-4 mr-2 text-primary" />
          <span className="flex-1 font-medium text-primary">
            Thêm mã khuyến mãi của Shop
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
