import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/constants/interfaces';
import { useNavigate } from 'react-router-dom';
import TopDeal from './top-deal';
import FreeshipExtra from './freeship-extra';
import Authentic from './authentic';
import { Star, StarHalf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  formatPrice: (price: number) => string;
}

// Simple custom rating component
function Rating({ value }: { value: number }) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-3 h-3 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      ))}
    </div>
  );
}

export default function ProductCard({
  product,
  formatPrice,
}: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-[1px] border-[#EBEBF0] bg-white cursor-pointer h-[531px] relative"
      onClick={() => navigate(`/books/${product.id}`)}
    >
      <CardContent className="p-0 h-full">
        {/* Picture area */}
        <div className="absolute left-0 right-0 top-0 h-[268px]">
          <img
            alt={product.title}
            src={product.thumbnailUrl || '/placeholder.svg'}
            className="w-full h-full object-cover"
          />
          {product.hasAd && (
            <span className="absolute top-2 right-2 rounded-md bg-[#F5F5FA] border border-white text-[#27272A] text-[10px] font-bold px-2 py-[2px] uppercase">
              AD
            </span>
          )}
          {/* Left badges */}
          <div className="absolute left-1 bottom-1 flex items-center gap-1">
            {product.isTopDeal && (
              <div className="rounded bg-red-100 overflow-hidden p-1">
                <TopDeal />
              </div>
            )}
            {product.isFreeshipXtra && (
              <div className="rounded bg-blue-100 overflow-hidden p-1">
                <FreeshipExtra />
              </div>
            )}
            {product.isAuthentic && (
              <div className="rounded bg-blue-100 overflow-hidden p-1">
                <Authentic />
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="absolute left-3 top-[288px] text-[#FF424E] font-semibold text-[18px] leading-[27px] flex items-baseline">
          {formatPrice(product.price)}
          <span className="text-[13px] leading-[20px] self-start">₫</span>
        </div>

        {/* Discount */}
        {product.discount > 0 && (
          <div
            className="absolute top-[288px] h-[21px] bg-[#F5F5FA] rounded-lg flex items-center justify-center px-2"
            style={{
              left: `${Math.max(
                88,
                60 + formatPrice(product.price).length * 5,
              )}px`,
            }}
          >
            <span className="text-[14px] leading-[21px] text-[#27272A]">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Author */}
        {product.author && (
          <div className="absolute left-3 right-3 top-[327px] h-[21px]">
            <p className="text-muted-foreground text-xs uppercase truncate">
              {product.author}
            </p>
          </div>
        )}

        {/* Title */}
        <div className="absolute left-3 right-3 top-[350px] h-[48px] mt-1">
          <h4 className="text-foreground text-base font-normal line-clamp-2">
            {product.title}
          </h4>
        </div>

        {/* Rating + Sold */}
        {(product.rating > 0 || product.sold > 0) && (
          <div className="absolute left-3 top-[409px] flex items-center space-x-2 text-xs text-muted-foreground">
            {product.rating > 0 && <Rating value={product.rating} />}
            {product.rating > 0 && product.sold > 0 && (
              <Separator orientation="vertical" className="h-3 bg-gray-300" />
            )}
            {product.sold > 0 && <span>Đã bán {product.sold}</span>}
          </div>
        )}

        {/* Divider */}
        <Separator className="absolute left-3 right-3 top-[503px] bg-[#EBEBF0]" />

        {/* Shipping */}
        <div className="absolute left-0 right-0 top-[508px] flex items-center text-muted-foreground text-xs px-3">
          {product.hasTikiNow ? (
            <>
              <img
                src="/src/assets/now.png" // Ensure correct path
                alt="NOW"
                className="h-[18px] mr-1"
              />
              <span>Giao siêu tốc 2h</span>
            </>
          ) : (
            <span>Giao thứ 3, 01/04</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
