import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Book } from '@/constants/interfaces';
import { useBook } from '@/hooks/useBook';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function CategoryProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  const { getBooksByCategory } = useBook();

  // Reset page when sort changes
  useEffect(() => {
    setCurrentPage(0);
  }, [sortBy]);

  // Fetch books by category
  useEffect(() => {
    const fetchBooks = async () => {
      if (!categoryId) {
        setError('Không tìm thấy danh mục');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params: any = { 
          page: currentPage, 
          size: pageSize 
        };

        // Add sort to params
        if (sortBy && sortBy !== 'default') {
          switch (sortBy) {
            case 'price-asc':
              params.sort = 'finalPrice,asc';
              break;
            case 'price-desc':
              params.sort = 'finalPrice,desc';
              break;
            case 'rating-desc':
              params.sort = 'ratingAvg,desc';
              break;
            case 'name-asc':
              params.sort = 'name,asc';
              break;
          }
        }

        const booksResponse = await getBooksByCategory(Number(categoryId), params);
        
        setBooks(booksResponse.data || []);
        setTotalPages(booksResponse.totalPages || 0);
        setTotalElements(booksResponse.totalElements || 0);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [categoryId, currentPage, sortBy, getBooksByCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get category name from the first book (if available)
  const categoryName = books[0]?.categories?.[0]?.name || 'Danh mục';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link to="/">
              <Button variant="ghost" className="mb-6 -ml-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  Đang tải dữ liệu...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <p className="text-lg text-destructive">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Thử lại
                </Button>
              </div>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      {categoryName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {totalElements} sản phẩm
                    </p>
                  </div>

                  {/* Sort Dropdown */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-background">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Mặc định</SelectItem>
                      <SelectItem value="price-asc">
                        Giá: Thấp đến cao
                      </SelectItem>
                      <SelectItem value="price-desc">
                        Giá: Cao đến thấp
                      </SelectItem>
                      <SelectItem value="rating-desc">
                        Đánh giá cao nhất
                      </SelectItem>
                      <SelectItem value="name-asc">Tên: A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Products Grid */}
                {books.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      {books.map((product) => (
                        <ProductCard 
                          key={product.id} 
                          product={{
                            ...product,
                            title: product.name,
                            author: product.authors?.map(a => a.name).join(', ') || '',
                            image: product.images[0]?.imageUrl || ''
                          }} 
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                        >
                          Trước
                        </Button>
                        
                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
                            const showPage =
                              page === 0 ||
                              page === totalPages - 1 ||
                              (page >= currentPage - 2 && page <= currentPage + 2);

                            if (!showPage) {
                              if (
                                page === currentPage - 3 ||
                                page === currentPage + 3
                              ) {
                                return (
                                  <span key={page} className="px-2 text-muted-foreground">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            }

                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="min-w-[40px]"
                              >
                                {page + 1}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages - 1}
                        >
                          Sau
                        </Button>
                        
                        <span className="text-sm text-muted-foreground ml-4">
                          Trang {currentPage + 1} / {totalPages}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">
                      Không tìm thấy sản phẩm nào trong danh mục này
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
