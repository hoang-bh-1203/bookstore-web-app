import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn chặn sự kiện click lan ra ngoài (nếu có)

    addToCart({
      productId: product.id, // map id -> productId
      name: product.title, // map title -> name
      thumbnailUrl: product.image, // map image -> thumbnailUrl
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      quantity: 1,
    });
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.image || '/placeholder.svg'}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold">
              -{discount}%
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <Link to={`/products/${product.id}`} className="block">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-2 h-10">
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground">{product.author}</p>
          </div>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-medium text-foreground">
              {product.rating}
            </span>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-secondary">
              {product.price.toLocaleString('vi-VN')}đ
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Thêm vào giỏ
        </Button>
      </div>
    </Card>
  );
}
