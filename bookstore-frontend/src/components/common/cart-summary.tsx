import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CartItem as ItemType } from '@/constants/interfaces';

type Props = {
  items: ItemType[];
  selectedItems: ItemType[];
  onCheckout: () => void;
};

const CartSummary: React.FC<Props> = ({ selectedItems, onCheckout }) => {
  const totalItems = selectedItems.length;
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0,
  );
  const shippingFee: number = 0;
  const total: number = subtotal + shippingFee;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sản phẩm ({totalItems})</span>
          <span className="font-medium">{subtotal.toLocaleString()}₫</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="text-green-600 font-medium">
            {shippingFee === 0
              ? 'Miễn phí'
              : `${shippingFee.toLocaleString()}₫`}
          </span>
        </div>

        <Separator className="my-3" />

        <div className="flex justify-between text-base lg:text-lg">
          <span className="font-semibold">Tổng cộng</span>
          <span className="font-bold text-destructive">
            {total.toLocaleString()}₫
          </span>
        </div>
      </div>

      <Button
        variant="destructive"
        size="lg"
        className="w-full"
        onClick={onCheckout}
        disabled={selectedItems.length === 0}
      >
        Tiến hành thanh toán
      </Button>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Bằng việc tiếp tục, bạn đồng ý với
          <a href="#" className="text-primary hover:underline ml-1">
            Điều khoản sử dụng
          </a>
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
