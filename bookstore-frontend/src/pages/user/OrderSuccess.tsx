import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber =
    searchParams.get('order') || 'ORD' + Date.now().toString().slice(-8);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Đặt hàng thành công!
            </h1>
            <p className="text-lg text-muted-foreground">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>
          </div>

          {/* Order Info Card */}
          <div className="bg-muted/30 border border-border rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Mã đơn hàng
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {orderNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Ngày đặt hàng
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date().toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-2">
              Thông tin quan trọng
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Email xác nhận đã được gửi đến địa chỉ email của bạn</li>
              <li>• Đơn hàng sẽ được giao trong vòng 3-5 ngày làm việc</li>
              <li>• Bạn có thể theo dõi đơn hàng qua mã đơn hàng ở trên</li>
              <li>• Liên hệ hotline 1900-xxxx nếu cần hỗ trợ</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/account/orders">Xem đơn hàng</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link to="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
