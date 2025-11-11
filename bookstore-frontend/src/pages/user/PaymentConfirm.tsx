// pages/user/PaymentConfirm.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PaymentHeader from '@/layouts/user/payment/PaymentHeader';
import FreeshipBanner from '@/components/common/freeship-banner';
import PaymentFooter from '@/layouts/user/payment/PaymentFooter';
import confirmPaymentBg from '@/assets/confirm-payment-bg.png';
import confirmIcon from '@/assets/icon-confirm-payment.png';
import { useNavigate } from 'react-router-dom';
import { clearRecentOrder, useCartStore } from '@/stores/useCartStore';
import { ShoppingBag } from 'lucide-react';

export default function PaymentConfirmation() {
  const recentOrder = useCartStore((state) => state.recentOrder);
  const navigate = useNavigate();

  const onNavigate = (url: string) => {
    clearRecentOrder();
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <FreeshipBanner />
      <PaymentHeader isConfirm />

      {recentOrder ? (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main confirmation card */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden border-0 shadow-lg bg-white rounded-md min-h-[500px] flex flex-col">
                <div className="absolute z-30 top-16 left-10 hidden md:block w-32">
                  <img
                    src={confirmIcon}
                    alt="Confirm Icon"
                    className="w-full h-auto"
                  />
                </div>
                <div className="relative">
                  {/* Gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600">
                    <img
                      src={confirmPaymentBg}
                      alt="bg"
                      className="w-full h-full object-cover opacity-30"
                    />
                  </div>

                  <div className="relative z-10 p-8 text-white flex justify-end min-h-[200px]">
                    <div className="w-full md:w-3/4 pl-4 flex flex-col justify-center">
                      <h2 className="text-2xl font-bold mb-2">
                        Yay, đặt hàng thành công!
                      </h2>
                      <p className="text-blue-100 text-lg">
                        Chuẩn bị tiền mặt{' '}
                        {Number(recentOrder.totalAmount).toLocaleString(
                          'vi-VN',
                        )}{' '}
                        ₫
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment details */}
                <div className="w-full md:w-3/4 self-end p-8 flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-2 border-b border-border py-4 text-muted-foreground mb-4">
                    <h3 className="font-medium">Phương thức thanh toán</h3>
                    <h3 className="text-right font-medium text-foreground">
                      Thanh toán tiền mặt
                    </h3>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="text-foreground font-medium">Tổng cộng</p>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">
                        {Number(recentOrder.totalAmount).toLocaleString(
                          'vi-VN',
                        )}{' '}
                        ₫
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Đã bao gồm VAT nếu có)
                      </p>
                    </div>
                  </div>

                  {/* Return button */}
                  <div className="mt-8">
                    <Button
                      variant="outline"
                      className="w-full h-11 text-primary border-primary hover:bg-primary/10"
                      onClick={() => onNavigate('/')}
                    >
                      Quay về trang chủ
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order details sidebar */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Mã đơn hàng:
                      </span>
                      <span className="font-semibold ml-2 text-foreground">
                        {recentOrder.orderId}
                      </span>
                    </div>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary"
                      onClick={() =>
                        onNavigate(`/profile/orders/${recentOrder.orderId}`)
                      }
                    >
                      Xem đơn hàng
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Separator />
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">
                      Thời gian giao hàng dự kiến:
                    </p>
                    <p className="font-medium text-foreground">
                      {recentOrder.deliveryDate}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 border">
                      {recentOrder.thumbnailUrl ? (
                        <img
                          src={recentOrder.thumbnailUrl}
                          alt={recentOrder.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground line-clamp-3">
                        {recentOrder.productName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[500px] flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p className="text-lg font-medium">Không có đơn hàng nào gần đây</p>
          </div>
          <Button size="lg" onClick={() => onNavigate('/')}>
            Quay về trang chủ
          </Button>
        </div>
      )}

      <PaymentFooter />
    </div>
  );
}
