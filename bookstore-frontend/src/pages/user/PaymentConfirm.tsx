import { AddressFormModal } from '@/components/address-form-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VoucherModal } from '@/components/voucher-modal';
import { useAuth } from '@/hooks/useAuth';
import { useBook } from '@/hooks/useBook';
import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder'; // Import hook mới
import { Footer } from '@/layouts/user/Footer';
import { Header } from '@/layouts/user/Header';
import {
  CreditCard,
  Loader2,
  MapPin,
  Tag,
  Ticket,
  Trash2,
  Truck,
} from 'lucide-react'; // Import Loader2
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ... (Giữ nguyên phần CONSTANT DISCOUNT_CODES)
const DISCOUNT_CODES = {
  // ... code cũ
  WELCOME10: {
    discount: 0.1,
    description: 'Giảm 10% cho đơn hàng đầu tiên',
    title: 'Giảm 10%',
    minOrder: 0,
    maxDiscount: 50000,
    type: 'product' as const,
  },
  BOOK20: {
    discount: 0.2,
    description: 'Giảm 20% cho đơn hàng từ 200k',
    title: 'Giảm 20%',
    minOrder: 200000,
    maxDiscount: 100000,
    type: 'product' as const,
  },
  // ...
  SHIP20K: {
    discount: 20000,
    description: 'Giảm 20k phí vận chuyển cho đơn từ 200k',
    title: 'Giảm ship 20k',
    minOrder: 200000,
    maxDiscount: 20000,
    type: 'shipping' as const,
  },
};

export default function CheckoutPage() {
  // Lấy hàm getCart để refresh lại giỏ sau khi mua
  const { selectedItems, selectedTotalPrice, getCart } = useCart();
  const { createOrder, isCreating } = useOrder(); // Hook xử lý order
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const { getBookById } = useBook();

  // ... (Giữ nguyên các state voucher, modal)
  const [appliedProductDiscount, setAppliedProductDiscount] = useState<{
    code: string;
    amount: number;
    description: string;
  } | null>(null);
  const [appliedShippingDiscount, setAppliedShippingDiscount] = useState<{
    code: string;
    amount: number;
    description: string;
  } | null>(null);

  const [deliveryMethod, setDeliveryMethod] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.fullName ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
  });

  const [quickBuyItems, setQuickBuyItems] = useState<any[]>([]);

  // ... (Giữ nguyên useEffect fetchQuickBuyProduct)
  useEffect(() => {
    const fetchQuickBuyProduct = async () => {
      const { bookId, quantity } = location.state || {};
      if (bookId && quantity) {
        try {
          const book = await getBookById(bookId);
          // Lưu ý: Quick Buy hiện tại đang giả lập item.
          // Backend yêu cầu item phải có trong DB Cart (cart_item_id) để tạo đơn.
          // Nếu Backend chưa hỗ trợ tạo đơn từ productId trực tiếp,
          // logic QuickBuy này có thể cần điều chỉnh để AddToCart ngầm trước.
          // Ở đây tôi giả định item trong selectedItems (từ cart) sẽ có id chuẩn.
          setQuickBuyItems([
            {
              id: 0, // Quick buy item chưa có cart_item_id nếu chưa add to cart
              productId: book.id, // Lưu productId để tham chiếu
              title: book.name,
              author: book.authors?.map((a) => a.name).join(', ') || '',
              price: book.finalPrice,
              image: book.images?.[0]?.imageUrl || '',
              quantity: quantity,
            },
          ]);
        } catch (error) {
          console.error('Error fetching quick buy product:', error);
        }
      }
    };
    fetchQuickBuyProduct();
  }, [location.state, getBookById]);

  const itemsToCheckout =
    quickBuyItems.length > 0 ? quickBuyItems : selectedItems;

  // Tính toán tổng tiền
  const totalPrice =
    quickBuyItems.length > 0
      ? quickBuyItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : selectedTotalPrice;

  const shippingFee = deliveryMethod === 'express' ? 30000 : 20000;
  const subtotal = totalPrice;

  // ... (Giữ nguyên logic Voucher: applyVoucherCode, removeDiscount)
  const applyVoucherCode = (code: string) => {
    if (!code) {
      const existingProductCode = appliedProductDiscount?.code;
      const existingShippingCode = appliedShippingDiscount?.code;

      if (
        existingProductCode &&
        DISCOUNT_CODES[existingProductCode as keyof typeof DISCOUNT_CODES]
      ) {
        setAppliedProductDiscount(null);
      }
      if (
        existingShippingCode &&
        DISCOUNT_CODES[existingShippingCode as keyof typeof DISCOUNT_CODES]
      ) {
        setAppliedShippingDiscount(null);
      }
      return;
    }

    const discount = DISCOUNT_CODES[code as keyof typeof DISCOUNT_CODES];
    if (!discount) return;

    if (subtotal < discount.minOrder) {
      toast.error(
        `Đơn hàng phải tối thiểu ${discount.minOrder.toLocaleString()}đ để dùng mã này`,
      );
      return;
    }

    let discountAmount =
      typeof discount.discount === 'number' && discount.discount < 1
        ? subtotal * discount.discount
        : discount.discount;

    if (discountAmount > discount.maxDiscount) {
      discountAmount = discount.maxDiscount;
    }

    const discountData = {
      code,
      amount: discountAmount,
      description: discount.description,
    };

    if (discount.type === 'product') {
      setAppliedProductDiscount(discountData);
    } else {
      setAppliedShippingDiscount(discountData);
    }
  };

  const removeDiscount = (type: 'product' | 'shipping') => {
    if (type === 'product') {
      setAppliedProductDiscount(null);
    } else {
      setAppliedShippingDiscount(null);
    }
  };

  const productDiscount = appliedProductDiscount?.amount || 0;
  const shippingDiscount = Math.min(
    appliedShippingDiscount?.amount || 0,
    shippingFee,
  );
  const finalShipping = shippingFee - shippingDiscount;
  const finalTotal = subtotal - productDiscount + finalShipping;
  const savings = productDiscount + shippingDiscount;

  // --- LOGIC XỬ LÝ THANH TOÁN ---
  const handleCheckout = async () => {
    // 1. Chuẩn bị địa chỉ
    const fullAddress = `${deliveryAddress.name} | ${deliveryAddress.phone} | ${deliveryAddress.address}`;

    // 2. Map Payment Method
    let backendPaymentMethod: 'COD' | 'VNPAY' | 'MOMO' | 'BANKING' = 'COD';
    if (paymentMethod === 'viettel') {
      backendPaymentMethod = 'BANKING';
    }

    // 3. Lấy Cart IDs (Giữ nguyên logic cũ)
    let selectedCartItemIds: number[] = [];
    if (quickBuyItems.length > 0) {
      toast.warning('Chức năng Mua Ngay đang bảo trì...');
      return;
    } else {
      selectedCartItemIds = itemsToCheckout.map((item) => item.id!);
    }

    try {
      // --- CẬP NHẬT PAYLOAD ---
      const payload = {
        address: fullAddress,
        methodPayment: backendPaymentMethod, // Bây giờ TypeScript đã hiểu đúng kiểu
        note: 'Giao hàng giờ hành chính',
        selectedCartItemIds: selectedCartItemIds,
        // Ép kiểu cho shippingMethod luôn để tránh lỗi tương tự
        shippingMethod: (deliveryMethod === 'express'
          ? 'EXPRESS'
          : 'STANDARD') as 'EXPRESS' | 'STANDARD',
      };

      const response = await createOrder(payload);

      if (response) {
        toast.success('Đặt hàng thành công!');
        getCart();
        const orderId = (response as any).data?.id || (response as any).id;
        navigate(`/order-success?order=${orderNumber(orderId)}`);
      }
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        'Đặt hàng thất bại. Vui lòng thử lại.';
      toast.error(msg);
    }
  };

  const orderNumber = (id: any) =>
    'ORD' + (id || Date.now().toString().slice(-6));

  if (itemsToCheckout.length === 0) {
    // ... (Giữ nguyên UI Empty Checkout)
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Chưa có sản phẩm nào được chọn
            </h2>
            <p className="text-muted-foreground mb-6">
              Vui lòng chọn sản phẩm từ giỏ hàng để thanh toán
            </p>
            <Link to="/cart">
              <Button>Quay lại giỏ hàng</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
            Thanh toán
          </h1>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Method */}
              {/* ... (Giữ nguyên UI Delivery Method) */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Chọn hình thức giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* ... radio buttons ... */}
                  <label
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        value="express"
                        checked={deliveryMethod === 'express'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Giao siêu tốc 2h
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            NEW
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Giao trước 13h hôm nay
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-foreground">
                      30.000đ
                    </span>
                  </label>
                  <label
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="delivery"
                        value="standard"
                        checked={deliveryMethod === 'standard'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-foreground">
                        Giao tiết kiệm
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">
                      20.000đ
                    </span>
                  </label>

                  {/* Product Preview */}
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 mb-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">
                        {deliveryMethod === 'express'
                          ? 'Gói: Giao siêu tốc 2h, trước 13h hôm nay'
                          : 'Gói: Giao tiết kiệm'}
                      </span>
                    </div>
                    {itemsToCheckout.slice(0, 1).map((item) => (
                      <div
                        key={item.id || item.productId}
                        className="flex gap-3 items-center"
                      >
                        <div className="relative w-12 h-16 flex-shrink-0">
                          <img
                            src={
                              item.image ||
                              item.thumbnailUrl ||
                              '/placeholder.svg'
                            }
                            alt={item.title || item.name}
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground line-clamp-1">
                            {item.title || item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            SL: x{item.quantity}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-foreground">
                              {item.price.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {itemsToCheckout.length > 1 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        +{itemsToCheckout.length - 1} sản phẩm khác
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Chọn hình thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-foreground font-medium">
                      Thanh toán tiền mặt (COD)
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'viettel'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="viettel"
                      checked={paymentMethod === 'viettel'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-foreground font-medium">
                      Chuyển khoản Ngân hàng / Viettel Money
                    </span>
                  </label>
                </CardContent>
              </Card>

              {/* Voucher Section */}
              {/* <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Mã giảm giá
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setVoucherModalOpen(true)}
                  >
                    <Ticket className="h-4 w-4 mr-2" />
                    Chọn hoặc nhập mã giảm giá
                  </Button>
                </CardContent>
              </Card> */}
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  {/* Address Summary */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Giao tới
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {deliveryAddress.name}
                        </p>
                        <p className="text-sm text-foreground">
                          {deliveryAddress.phone}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary h-auto p-0"
                      onClick={() => setAddressModalOpen(true)}
                    >
                      Thay đổi
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {deliveryAddress.address}
                  </p>

                  <Separator className="my-4" />

                  {/* Summary Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tổng tiền hàng
                      </span>
                      <span className="text-foreground font-medium">
                        {subtotal.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Phí vận chuyển
                      </span>
                      <span className="text-foreground font-medium">
                        {shippingFee.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    {/* Discount Displays ... */}
                    {productDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Giảm giá sản phẩm
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          -{productDiscount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    )}
                    {shippingDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Giảm phí vận chuyển
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          -{shippingDiscount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base font-semibold text-foreground">
                      Tổng tiền thanh toán
                    </span>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {finalTotal.toLocaleString('vi-VN')}đ
                      </p>
                      {savings > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Tiết kiệm {savings.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    (Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển
                    và các chi phí khác)
                  </p>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCreating} // Disable khi đang gọi API
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đặt hàng'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <VoucherModal
        open={voucherModalOpen}
        onOpenChange={setVoucherModalOpen}
        subtotal={subtotal}
        onApplyVoucher={applyVoucherCode}
        appliedProductCode={appliedProductDiscount?.code || null}
        appliedShippingCode={appliedShippingDiscount?.code || null}
      />

      <AddressFormModal
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        currentAddress={deliveryAddress}
        onSave={setDeliveryAddress}
      />
    </div>
  );
}
