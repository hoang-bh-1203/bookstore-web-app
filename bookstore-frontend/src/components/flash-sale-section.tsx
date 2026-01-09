import type { Book } from '@/constants/interfaces';
import { useBook } from '@/hooks/useBook';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function FlashSaleSection() {
  const [products, setProducts] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllBooks } = useBook();

  useEffect(() => {
    const fetchDiscountBooks = async () => {
      try {
        setLoading(true);
        const response = await getAllBooks({
          page: 0,
          size: 5,
          sort: 'discount,desc',
        });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching discount books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountBooks();
  }, [getAllBooks]);

  if (loading) {
    return (
      <div className="bg-red-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-white text-center">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-600 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">⚡ FLASH SALE</h2>
          <a href="/products" className="text-white hover:underline">
            Xem tất cả →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => {
            const discountPercentage = product.price > 0 ? product.discount : 0;

            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={product.images[0]?.imageUrl || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-red-600 font-bold">
                      {product.finalPrice.toLocaleString('vi-VN')}đ
                    </p>
                    {product.discount > 0 && (
                      <p className="text-gray-400 text-xs line-through">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
