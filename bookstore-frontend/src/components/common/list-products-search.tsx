import type { Product, ProductSearchResponse } from '@/constants/interfaces';
import { useEffect, useState, useRef } from 'react';
import ProductCard from './product-card';
import { Request } from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search } from 'lucide-react';
import NoProductsFound from './no-products-found';

const ListProductsSearch: React.FC<{ keyword: string }> = ({ keyword }) => {
  // Data + UI state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [, setCurrentPage] = useState(0); // keep setter for reset
  const [totalElements, setTotalElements] = useState(0);

  // Pagination config
  const PAGE_SIZE = 8;

  // Refs for infinite scroll and concurrency control
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(0);
  const isResettingRef = useRef(false);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN');

  // Fetch products by keyword, supports append mode
  const fetchProductsWithKeyword = async (
    page: number,
    append = false,
  ): Promise<void> => {
    try {
      setLoading(true);

      const params: any = {
        page,
        size: PAGE_SIZE,
        keyword: keyword?.trim() || undefined,
      };

      const response = await Request.get<ProductSearchResponse>(
        API_ENDPOINTS.SEARCH_PRODUCTS,
        { params },
      );

      if (response && response.content) {
        const fetched: Product[] = response.content;

        // When appending, avoid duplicates by id
        if (append) {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newItems = fetched.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newItems];
          });
        } else {
          setProducts(fetched);
        }

        // Update pagination flags (use response.last if available)
        if (typeof (response as any).last === 'boolean') {
          setHasMore(!(response as any).last);
        } else {
          setHasMore(fetched.length === PAGE_SIZE);
        }

        if (typeof response.totalElements === 'number') {
          setTotalElements(response.totalElements);
        }
      } else {
        if (!append) setProducts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching products by keyword:', error);
    } finally {
      setLoading(false);
      if (isResettingRef.current) {
        setTimeout(() => {
          isResettingRef.current = false;
        }, 50);
      }
    }
  };

  const resetPagination = () => {
    isResettingRef.current = true;
    setCurrentPage(0);
    currentPageRef.current = 0;
    setProducts([]);
    setHasMore(true);
    setTimeout(() => {
      isResettingRef.current = false;
    }, 100);
  };

  const loadMore = () => {
    if (loading || !hasMore || isResettingRef.current) return;
    const nextPage = currentPageRef.current + 1;
    currentPageRef.current = nextPage;
    setCurrentPage(nextPage);
    fetchProductsWithKeyword(nextPage, true);
  };

  useEffect(() => {
    resetPagination();
    fetchProductsWithKeyword(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            hasMore &&
            !loading &&
            !isResettingRef.current
          ) {
            loadMore();
          }
        });
      },
      { root: null, rootMargin: '200px', threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      {products && products.length > 0 ? (
        <>
          <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
            <Search className="h-4 w-4" />
            <AlertTitle>Kết quả tìm kiếm</AlertTitle>
            <AlertDescription>
              Tìm thấy {totalElements} sản phẩm cho từ khóa: "
              <strong>{keyword}</strong>"
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pb-2">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} formatPrice={formatPrice} />
              </div>
            ))}
          </div>

          {loading && (
            <div className="w-full flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          <div ref={sentinelRef} />

          {!hasMore && products.length > 0 && (
            <div className="w-full text-center py-6 text-sm text-muted-foreground">
              Đã hiển thị tất cả sản phẩm
            </div>
          )}
        </>
      ) : loading ? (
        <div className="w-full flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <NoProductsFound keyword={keyword} />
      )}
    </>
  );
};

export default ListProductsSearch;
