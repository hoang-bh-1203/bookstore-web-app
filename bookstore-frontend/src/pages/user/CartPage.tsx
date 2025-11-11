import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '@/components/common/cart-item';
import CartSummary from '@/components/common/cart-summary';
import EmptyCart from '@/components/empty-cart';
import { LoginModal } from '@/components/forms/login-modal-form';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, validateCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Yêu cầu đăng nhập', {
        description: 'Vui lòng đăng nhập để xem giỏ hàng',
      });
      openLoginModal();
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, openLoginModal, navigate]);

  const areAllSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(cartItems.map((item) => item.productId || 0)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: number, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) newSelected.add(id);
    else newSelected.delete(id);
    setSelectedItems(newSelected);
  };

  const handleRemoveSelected = () => {
    if (selectedItems.size === 0) {
      toast.warning('Vui lòng chọn sản phẩm để xóa');
      return;
    }
    selectedItems.forEach((id) => removeFromCart(id));
    setSelectedItems(new Set());
    toast.success('Đã xóa các sản phẩm đã chọn');
  };

  const handleCheckout = async () => {
    if (selectedItems.size === 0) {
      toast.warning('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }
    try {
      const selectedCartItems = cartItems.filter((item) =>
        selectedItems.has(item.productId || 0),
      );
      await validateCart(selectedCartItems);
      if (selectedCartItems.length > 0) {
        navigate('/payment', { state: { selectedCartItems } });
      }
    } catch (error: any) {
      console.error('Error validating cart:', error);
      toast.error('Lỗi xác nhận giỏ hàng', {
        description: error?.data?.message || 'Có lỗi xảy ra',
      });
    }
  };

  if (!isAuthenticated) return null; // Or loading spinner handled by wrapper
  if (cartItems.length === 0) return <EmptyCart />;

  return (
    <>
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-2xl font-semibold mb-4">GIỎ HÀNG</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border mb-4">
              {/* Header */}
              <div className="flex items-center p-4 border-b">
                <div className="w-12 flex justify-center">
                  <Checkbox
                    checked={areAllSelected}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked as boolean)
                    }
                    aria-label="Select all"
                  />
                </div>
                <div className="flex-1 font-medium text-muted-foreground hidden md:block">
                  Tất cả ({cartItems.length} sản phẩm)
                </div>
                <div className="flex-1 font-medium md:hidden">Chọn tất cả</div>
                <div className="hidden md:flex w-32 text-center text-sm text-muted-foreground">
                  Đơn giá
                </div>
                <div className="hidden md:flex w-32 text-center text-sm text-muted-foreground">
                  Số lượng
                </div>
                <div className="hidden md:flex w-32 text-center text-sm text-muted-foreground">
                  Thành tiền
                </div>
                <div className="w-12 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveSelected}
                    disabled={selectedItems.size === 0}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {/* Items */}
              <div className="divide-y">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.productId || 0}
                    item={item}
                    isSelected={selectedItems.has(item.productId || 0)}
                    onSelect={handleSelectItem}
                    onQuantityChange={(id, quantity) =>
                      updateQuantity({ id, quantity })
                    }
                    onRemove={(id) => {
                      removeFromCart(id);
                      setSelectedItems((prev) => {
                        const next = new Set(prev);
                        next.delete(id);
                        return next;
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <CartSummary
              items={cartItems}
              selectedItems={cartItems.filter((item) =>
                selectedItems.has(item.productId || 0),
              )}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
      <LoginModal />
    </>
  );
};

export default CartPage;
