import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Book, Category } from '@/constants/interfaces';
import { useBook } from '@/hooks/useBook';
import { useCategory } from '@/hooks/useCategory';
import {
  ChevronDown,
  ChevronUp,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterSidebarProps {
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedRating: number;
  setSelectedRating: (value: number) => void;
  resetFilters: () => void;
}

const FilterSidebar = ({
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  resetFilters,
}: FilterSidebarProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const INITIAL_CATEGORY_COUNT = 5;

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, INITIAL_CATEGORY_COUNT);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Tìm kiếm</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm sách, tác giả..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            // Auto focus vào input nếu cần thiết, nhưng cấu trúc đúng thì không cần
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Danh mục</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory('Tất cả')}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === 'Tất cả'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            Tất cả
          </button>
          {displayedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category.name
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              {category.name}
            </button>
          ))}

          {categories.length > INITIAL_CATEGORY_COUNT && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="w-full text-left px-3 py-2 text-primary hover:bg-muted rounded-md transition-colors flex items-center gap-2"
            >
              {showAllCategories ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Ẩn bớt
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Xem thêm ({categories.length - INITIAL_CATEGORY_COUNT})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {[
            { label: 'Tất cả', min: 0, max: 1000000 },
            { label: 'Dưới 50.000đ', min: 0, max: 50000 },
            { label: '50.000đ - 100.000đ', min: 50000, max: 100000 },
            { label: '100.000đ - 200.000đ', min: 100000, max: 200000 },
            { label: '200.000đ - 500.000đ', min: 200000, max: 500000 },
            { label: 'Trên 500.000đ', min: 500000, max: 1000000 },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() => setPriceRange([range.min, range.max])}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                priceRange[0] === range.min && priceRange[1] === range.max
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Đánh giá</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1, 0].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                selectedRating === rating
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              {rating === 0 ? (
                'Tất cả'
              ) : (
                <>
                  <span className="text-yellow-500">★</span>
                  {rating}+ sao
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory !== 'Tất cả' ||
        searchQuery.trim() !== '' ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 1000000 ||
        selectedRating !== 0) && (
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={resetFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [semanticQuery, setSemanticQuery] = useState('');
  const [semanticSearchActive, setSemanticSearchActive] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('default');

  // State for API data
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  // Get hooks
  const { getAllBooks, getBooksByPriceRange, getBooksByCategory, searchBooks } =
    useBook();
  const { getAllCategoriesWithSub } = useCategory();

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getAllCategoriesWithSub();
        setCategories(categoriesResponse || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, [getAllCategoriesWithSub]);

  // Reset page to 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [
    selectedCategory,
    searchQuery,
    semanticSearchActive,
    priceRange,
    selectedRating,
    sortBy,
  ]);

  // Fetch books whenever page or filters change
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build filter params
        const params: any = {
          page: currentPage,
          size: pageSize,
        };

        // Tìm category object từ selectedCategory name
        const selectedCategoryObj = categories.find(
          (cat) => cat.name === selectedCategory,
        );
        const hasCategoryFilter =
          selectedCategory &&
          selectedCategory !== 'Tất cả' &&
          selectedCategoryObj;

        // Kiểm tra xem có filter theo giá không (và khác mặc định)
        const hasPriceFilter = priceRange[0] !== 0 || priceRange[1] !== 1000000;
        const hasOtherFilters = searchQuery.trim() || selectedRating > 0;

        let booksResponse;

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

        // Nếu semantic search được kích hoạt, dùng semantic search endpoint
        if (semanticSearchActive && semanticQuery.trim()) {
          const searchResults = await searchBooks(semanticQuery.trim());

          // Lọc kết quả search theo các filters khác (client-side)
          let filteredResults = searchResults;

          // Filter by category
          if (hasCategoryFilter) {
            filteredResults = filteredResults.filter(
              (book) => book.categoryName === selectedCategory,
            );
          }

          // Filter by price range
          if (hasPriceFilter) {
            filteredResults = filteredResults.filter(
              (book) =>
                book.finalPrice >= priceRange[0] &&
                book.finalPrice <= priceRange[1],
            );
          }

          // Filter by rating
          if (selectedRating > 0) {
            filteredResults = filteredResults.filter(
              (book) => book.ratingAvg >= selectedRating,
            );
          }

          // Sort results client-side
          if (sortBy && sortBy !== 'default') {
            filteredResults = [...filteredResults].sort((a, b) => {
              switch (sortBy) {
                case 'price-asc':
                  return a.finalPrice - b.finalPrice;
                case 'price-desc':
                  return b.finalPrice - a.finalPrice;
                case 'rating-desc':
                  return b.ratingAvg - a.ratingAvg;
                case 'name-asc':
                  return a.name.localeCompare(b.name);
                default:
                  return 0;
              }
            });
          }

          // Simulate pagination for search results
          const startIndex = currentPage * pageSize;
          const paginatedResults = filteredResults.slice(
            startIndex,
            startIndex + pageSize,
          );

          booksResponse = {
            data: paginatedResults,
            totalPages: Math.ceil(filteredResults.length / pageSize),
            totalElements: filteredResults.length,
          };
        }
        // Nếu có filter theo category (không có filter khác), dùng endpoint by-category
        else if (hasCategoryFilter && !hasPriceFilter && !hasOtherFilters) {
          booksResponse = await getBooksByCategory(
            selectedCategoryObj.id,
            params,
          );
        }
        // Nếu chỉ filter theo giá (không có filter khác), dùng endpoint by-price-range
        else if (hasPriceFilter && !hasCategoryFilter && !hasOtherFilters) {
          params.minPrice = priceRange[0];
          params.maxPrice = priceRange[1];
          booksResponse = await getBooksByPriceRange(params);
        }
        // Dùng endpoint /products với tất cả filters
        else {
          // Add search keyword
          if (searchQuery.trim()) {
            params.keyword = searchQuery.trim();
          }

          // Add category filter
          if (hasCategoryFilter) {
            params.categoryName = selectedCategory;
          }

          // Add price range filter
          if (hasPriceFilter) {
            params.minPrice = priceRange[0];
            params.maxPrice = priceRange[1];
          }

          // Add rating filter
          if (selectedRating > 0) {
            params.minRating = selectedRating;
          }

          booksResponse = await getAllBooks(params);
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    selectedCategory,
    searchQuery,
    semanticSearchActive,
    priceRange,
    selectedRating,
    sortBy,
  ]);

  // API đã xử lý filter và sort, không cần filter/sort ở client nữa
  const displayedProducts = books;
  const resetFilters = () => {
    setSelectedCategory('Tất cả');
    setSearchQuery('');
    setSemanticQuery('');
    setSemanticSearchActive(false);
    setPriceRange([0, 1000000]);
    setSelectedRating(0);
    setSortBy('default');
    setCurrentPage(0);
  };

  const handleSemanticSearch = () => {
    if (semanticQuery.trim()) {
      setSemanticSearchActive(true);
      setCurrentPage(0);
    }
  };

  const clearSemanticSearch = () => {
    setSemanticQuery('');
    setSemanticSearchActive(false);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarProps = {
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedRating,
    setSelectedRating,
    resetFilters,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-4">
                  {/* 4. Truyền props vào component */}
                  <FilterSidebar {...sidebarProps} />
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
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
                    {/* Semantic Search Bar */}
                    <div className="mb-6 bg-card rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Tìm kiếm ngữ nghĩa (AI-powered)..."
                            className="pl-10"
                            value={semanticQuery}
                            onChange={(e) => setSemanticQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSemanticSearch();
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={handleSemanticSearch}
                          disabled={!semanticQuery.trim()}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Tìm kiếm
                        </Button>
                        {semanticSearchActive && (
                          <Button
                            variant="outline"
                            onClick={clearSemanticSearch}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Xóa
                          </Button>
                        )}
                      </div>
                      {semanticSearchActive && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Đang tìm kiếm ngữ nghĩa: "{semanticQuery}"
                        </p>
                      )}
                    </div>

                    {/* Mobile Filter Button and Results */}
                    <div className="flex items-center justify-between mb-6 gap-4">
                      <p className="text-sm text-muted-foreground">
                        Hiển thị {displayedProducts.length} / {totalElements}{' '}
                        sản phẩm
                      </p>

                      <div className="flex items-center gap-3">
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

                        {/* Mobile Filter Sheet */}
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              className="lg:hidden bg-transparent"
                            >
                              <SlidersHorizontal className="h-4 w-4 mr-2" />
                              Bộ lọc
                            </Button>
                          </SheetTrigger>
                          <SheetContent
                            side="left"
                            className="w-80 overflow-y-auto"
                          >
                            <SheetHeader>
                              <SheetTitle>Bộ lọc</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                              {/* 4. Truyền props vào component (tái sử dụng) */}
                              <FilterSidebar {...sidebarProps} />
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>

                    {/* Products Grid */}
                    {displayedProducts.length > 0 ? (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                          {displayedProducts.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={{
                                ...product,
                                title: product.name,
                                author:
                                  product.authors
                                    ?.map((a) => a.name)
                                    .join(', ') || '',
                                image: product.images[0]?.imageUrl || '',
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
                              {Array.from(
                                { length: totalPages },
                                (_, i) => i,
                              ).map((page) => {
                                // Hiển thị: trang đầu, trang cuối, trang hiện tại và 2 trang xung quanh
                                const showPage =
                                  page === 0 ||
                                  page === totalPages - 1 ||
                                  (page >= currentPage - 2 &&
                                    page <= currentPage + 2);

                                if (!showPage) {
                                  // Hiển thị dấu "..." nếu có khoảng cách
                                  if (
                                    page === currentPage - 3 ||
                                    page === currentPage + 3
                                  ) {
                                    return (
                                      <span
                                        key={page}
                                        className="px-2 text-muted-foreground"
                                      >
                                        ...
                                      </span>
                                    );
                                  }
                                  return null;
                                }

                                return (
                                  <Button
                                    key={page}
                                    variant={
                                      currentPage === page
                                        ? 'default'
                                        : 'outline'
                                    }
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
                              Trang {currentPage + 1} / {totalPages} (
                              {totalElements} sản phẩm)
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <p className="text-lg text-muted-foreground">
                          Không tìm thấy sản phẩm nào
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
