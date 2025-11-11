import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 max-w-md mx-auto px-4 flex flex-col items-center">
      <div className="mb-6 text-muted-foreground">
        <ShoppingCart className="h-16 w-16 opacity-20" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-muted-foreground mb-8">
        Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán
      </p>
      <Button size="lg" onClick={() => navigate('/')} className="gap-2">
        <ShoppingCart className="h-5 w-5" />
        Mua sắm ngay
      </Button>
    </div>
  );
};

export default EmptyCart;
