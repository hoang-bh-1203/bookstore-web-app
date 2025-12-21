import { useMemo, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CartWithBadge = () => {
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useModal();
  const navigate = useNavigate();

  const totalItems = useMemo(() => {
    return cartItems.length;
  }, [cartItems]);

  const handleCartClick = useCallback(() => {
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      toast.warning('Yêu cầu đăng nhập', {
        description: 'Vui lòng đăng nhập để xem giỏ hàng',
      });
      openLoginModal();
    }
  }, [isAuthenticated, navigate, openLoginModal]);

  return (
    <div
      onClick={handleCartClick}
      className="cursor-pointer relative flex items-center"
    >
      <ShoppingCart className="h-6 w-6 lg:text-blue-600 text-white" />
      {isAuthenticated && totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] rounded-full border-2 border-white"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </div>
  );
};

export default CartWithBadge;
