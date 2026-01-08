import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart'; // Hook mới của bạn
import { useModal } from '@/hooks/useModal';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

const CartPage = () => {
  const navigate = useNavigate();
  const { openLoginModal } = useModal();

  // 1. Lấy tất cả state và action cần thiết từ useCart hook mới
  const {
    cartItems, // Danh sách toàn bộ sản phẩm (để render list)
    selectedItems, // Danh sách sản phẩm đang được tick chọn (để tính toán/checkout)
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleItemSelection,
    toggleAllSelection,
    selectedTotalPrice, // Tổng tiền của các item được chọn
    allSelected, // Trạng thái checkbox "Chọn tất cả"
    validateCart,
    isAuthenticated,
  } = useCart();

  // 2. Check Auth
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Yêu cầu đăng nhập', {
        description: 'Vui lòng đăng nhập để xem giỏ hàng',
      });
      openLoginModal();
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, openLoginModal, navigate]);

  // 3. Xử lý Checkout
  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }

    navigate('/confirm', { state: { selectedCartItems: selectedItems } });

    // try {
    //   // Validate các item đang được chọn với API
    //   await validateCart(selectedItems);

    //   // Chuyển hướng sang trang thanh toán
    //   navigate('/payment', { state: { selectedCartItems: selectedItems } });
    // } catch (error: any) {
    //   console.error('Error validating cart:', error);
    //   toast.error('Lỗi xác nhận giỏ hàng', {
    //     description:
    //       error?.data?.message || 'Có lỗi xảy ra khi kiểm tra tồn kho',
    //   });
    // }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-6 px-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Giỏ hàng trống
              </h2>
              <p className="text-muted-foreground">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
            </div>
            <Link to="/products">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Khám phá sản phẩm
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 5. Main Render
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
            Giỏ hàng của bạn
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* --- Cột bên trái: Danh sách sản phẩm --- */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header: Chọn tất cả */}
              <Card className="p-4 border-border">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={toggleAllSelection}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    Chọn tất cả ({cartItems.length} sản phẩm)
                  </label>
                </div>
              </Card>

              {/* List Items */}
              {cartItems.map((item) => (
                <Card key={item.productId} className="p-4 border-border">
                  <div className="flex gap-4">
                    {/* Checkbox item */}
                    <div className="flex items-start pt-2">
                      <Checkbox
                        id={`item-${item.productId}`}
                        checked={item.selected}
                        // Hook xử lý toggle dựa trên productId
                        onCheckedChange={() =>
                          toggleItemSelection(item.productId)
                        }
                      />
                    </div>

                    {/* Product Image */}
                    {/* Lưu ý: Dữ liệu trong store dùng thumbnailUrl thay vì image */}
                    <div className="relative w-24 h-32 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <img
                        src={item.thumbnailUrl || '/placeholder.svg'}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Lưu ý: Dữ liệu store dùng name thay vì title */}
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity({
                                id: item.productId,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-12 text-center font-medium text-foreground">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity({
                                id: item.productId,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-secondary">
                            {(item.price * item.quantity).toLocaleString(
                              'vi-VN',
                            )}
                            đ
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Clear Cart Button */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>

            {/* --- Cột bên phải: Order Summary --- */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-border sticky top-24">
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">
                  Tóm tắt đơn hàng
                </h2>

                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Đã chọn{' '}
                    <span className="font-semibold text-foreground">
                      {selectedItems.length}
                    </span>{' '}
                    sản phẩm
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium text-foreground">
                      {selectedTotalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Phí vận chuyển
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedItems.length > 0 ? '30.000đ' : '0đ'}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">
                        Tổng cộng
                      </span>
                      <span className="text-xl font-bold text-secondary">
                        {(
                          selectedTotalPrice +
                          (selectedItems.length > 0 ? 30000 : 0)
                        ).toLocaleString('vi-VN')}
                        đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3"
                  disabled={selectedItems.length === 0}
                  onClick={handleCheckout}
                >
                  Thanh toán ({selectedItems.length})
                </Button>

                <Link to="/products">
                  <Button variant="outline" className="w-full bg-transparent">
                    Tiếp tục mua sắm
                  </Button>
                </Link>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Miễn phí vận chuyển cho đơn hàng trên 200.000đ
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Đổi trả trong vòng 7 ngày
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Thanh toán an toàn và bảo mật
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
