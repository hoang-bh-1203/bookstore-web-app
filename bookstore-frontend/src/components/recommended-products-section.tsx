import type { Book } from '@/constants/interfaces';
import { useBook } from '@/hooks/useBook';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function RecommendedProductsSection() {
  const [products, setProducts] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllBooks } = useBook();

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        setLoading(true);
        const response = await getAllBooks({
          page: 0,
          size: 8,
          sort: 'ratingAvg,desc'
        });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching top rated books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedBooks();
  }, [getAllBooks]);

  if (loading) {
    return (
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Sách Được Đánh Giá Cao</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={product.images[0]?.imageUrl || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-xs">{product.ratingAvg.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({product.ratingCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-red-600 font-bold text-sm">
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
          ))}
        </div>
      </div>
    </div>
  );
}
