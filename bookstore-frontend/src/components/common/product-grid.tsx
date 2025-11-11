import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Filter,
  ThumbsUp,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from 'lucide-react';
import ProductCard from './product-card';
import { Request } from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import { useLoading } from '@/hooks/useLoading';
import type { Product, ProductSearchResponse } from '@/constants/interfaces';
import { Star } from 'lucide-react'; // Use star icon for rating filter

export interface ProductGridRef {
  handleCategorySelect: (categoryId: number | null) => void;
}

const tabs = [
  { id: 'popular', label: 'Phổ biến' },
  { id: 'bestselling', label: 'Bán chạy' },
  { id: 'new', label: 'Hàng mới' },
  { id: 'price', label: 'Giá' },
];

const ProductGrid = forwardRef<ProductGridRef>((props, ref) => {
  const { showLoading, hideLoading } = useLoading();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [, setCurrentPage] = useState(0);
  const [, setTotalElements] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [sort, setSort] = useState<'popular' | 'price-asc' | 'price-desc'>(
    'popular',
  );
  const [filters, setFilters] = useState({
    minRating: 0,
    hasTikiNow: false,
    isTopDeal: false,
    isFreeshipXtra: false,
  });

  const PAGE_SIZE = 8;
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(0);
  const isResettingRef = useRef(false);
  const [activeTab, setActiveTab] = useState('popular');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');

  useImperativeHandle(ref, () => ({
    handleCategorySelect: (categoryId: number | null) => {
      setSelectedCategoryId(categoryId);
      resetPagination();
      fetchProductsWithCategory(0, sort, false, categoryId, filters);
    },
  }));

  const formatPrice = (price: number) => price.toLocaleString('vi-VN');

  const fetchProductsWithCategory = async (
    page: number,
    sortBy: string,
    append: boolean = false,
    categoryId: number | null = null,
    currentFilters: typeof filters,
  ) => {
    try {
      setLoading(true);
      const params: any = {
        page: page,
        size: PAGE_SIZE,
        sortBy:
          sortBy === 'popular'
            ? 'popular'
            : sortBy === 'price-asc'
              ? 'price_asc'
              : 'price_desc',
      };
      if (currentFilters.minRating > 0)
        params.minRating = currentFilters.minRating;
      if (categoryId !== null) params.categoryId = categoryId;

      const response = await Request.get<ProductSearchResponse>(
        API_ENDPOINTS.SEARCH_PRODUCTS,
        { params },
      );

      if (response && response.content) {
        let filteredProducts = response.content;
        // Client-side filters (demo logic kept from original)
        if (currentFilters.hasTikiNow)
          filteredProducts = filteredProducts.filter((p) => p.hasTikiNow);
        if (currentFilters.isTopDeal)
          filteredProducts = filteredProducts.filter((p) => p.isTopDeal);
        if (currentFilters.isFreeshipXtra)
          filteredProducts = filteredProducts.filter((p) => p.isFreeshipXtra);

        if (append) {
          setProducts((prev) => [...prev, ...filteredProducts]);
        } else {
          setProducts(filteredProducts);
        }
        setHasMore(!response.last && filteredProducts.length === PAGE_SIZE);
        setTotalElements(response.totalElements);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (
    page: number,
    sortBy: string,
    append: boolean = false,
  ) => {
    return fetchProductsWithCategory(
      page,
      sortBy,
      append,
      selectedCategoryId,
      filters,
    );
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

  const handleFilterChange = async (
    filterName: keyof typeof filters,
    value: boolean | number,
  ) => {
    showLoading('Đang tải sản phẩm...');
    resetPagination();
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await fetchProductsWithCategory(
        0,
        sort,
        false,
        selectedCategoryId,
        newFilters,
      );
    } finally {
      hideLoading();
    }
  };

  const handleSortChange = async (
    value: 'popular' | 'price-asc' | 'price-desc',
  ) => {
    showLoading('Đang sắp xếp sản phẩm...');
    resetPagination();
    setSort(value);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await fetchProductsWithCategory(
        0,
        value,
        false,
        selectedCategoryId,
        filters,
      );
    } finally {
      hideLoading();
    }
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === activeTab && tabId !== 'price') return;
    if (tabId === 'price') {
      setPriceSort((prev) => (prev === 'desc' ? 'asc' : 'desc'));
      setActiveTab(tabId);
      handleSortChange(`price-${priceSort === 'asc' ? 'desc' : 'asc'}` as any);
      return;
    }
    setActiveTab(tabId);
    handleSortChange(tabId as any);
  };

  useEffect(() => {
    resetPagination();
    fetchProducts(0, sort, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    if (loading || !hasMore || isResettingRef.current) return;
    const nextPage = currentPageRef.current + 1;
    setCurrentPage(nextPage);
    currentPageRef.current = nextPage;
    fetchProducts(nextPage, sort, true);
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !isResettingRef.current
        ) {
          loadMore();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="bg-[#F5F5FA]">
      {/* Filter and Sort Section */}
      <div className="p-1 lg:p-4 bg-white lg:rounded-lg shadow-sm border mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4 hidden lg:block">
          Tất cả sản phẩm
        </h2>

        {/* Desktop Filters */}
        <div className="hidden lg:flex flex-wrap gap-6 mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tikiNow"
              checked={filters.hasTikiNow}
              onCheckedChange={(checked) =>
                handleFilterChange('hasTikiNow', checked as boolean)
              }
            />
            <Label
              htmlFor="tikiNow"
              className="flex items-center cursor-pointer font-normal"
            >
              <span className="text-red-500 font-bold mr-1">NOW</span>
              <span>Giao siêu tốc 2H</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="topDeal"
              checked={filters.isTopDeal}
              onCheckedChange={(checked) =>
                handleFilterChange('isTopDeal', checked as boolean)
              }
            />
            <Label
              htmlFor="topDeal"
              className="flex items-center cursor-pointer font-normal"
            >
              <ThumbsUp className="text-red-500 h-4 w-4 mr-1 fill-current" />
              <span className="text-red-500 font-bold mr-1">TOP DEAL</span>
              <span>Siêu rẻ</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="freeship"
              checked={filters.isFreeshipXtra}
              onCheckedChange={(checked) =>
                handleFilterChange('isFreeshipXtra', checked as boolean)
              }
            />
            <Label
              htmlFor="freeship"
              className="flex items-center cursor-pointer font-normal"
            >
              <span className="text-blue-500 font-bold mr-1">FREESHIP</span>
              <span className="text-green-500 font-bold">XTRA</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rating"
              checked={filters.minRating > 0}
              onCheckedChange={(checked) =>
                handleFilterChange('minRating', checked ? 4 : 0)
              }
            />
            <Label
              htmlFor="rating"
              className="flex items-center cursor-pointer font-normal"
            >
              <div className="flex mr-2">
                {[1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <Star className="w-4 h-4 text-gray-300" />
              </div>
              <span>từ 4 sao</span>
            </Label>
          </div>
        </div>

        {/* Mobile Navigation Tabs & Filters */}
        <div className="lg:hidden bg-white">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 py-3 px-2 text-sm font-medium text-center transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {tab.label}
                  {tab.id === 'price' &&
                    (activeTab === tab.id ? (
                      priceSort === 'desc' ? (
                        <ArrowDownNarrowWide className="h-3 w-3" />
                      ) : (
                        <ArrowUpNarrowWide className="h-3 w-3" />
                      )
                    ) : (
                      <ArrowUpNarrowWide className="h-3 w-3 text-muted-foreground/50" />
                    ))}
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 p-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-md">
              <Filter className="h-3 w-3" /> <span>Lọc</span>
            </div>
            {/* Mobile Filter Buttons (Simplified for brevity, ideally mapped) */}
            <button
              onClick={() =>
                handleFilterChange('hasTikiNow', !filters.hasTikiNow)
              }
              className={`px-2 py-1 rounded-full text-xs font-bold border ${filters.hasTikiNow ? 'bg-red-50 border-red-500 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            >
              NOW
            </button>
            {/* ... other mobile filter buttons similar to above ... */}
          </div>
        </div>

        {/* Desktop Sort */}
        <div className="hidden lg:flex items-center mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground mr-3">Sắp xếp</span>
          <Select
            value={sort}
            onValueChange={(val: any) => handleSortChange(val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Phổ biến</SelectItem>
              <SelectItem value="price-asc">Giá tăng dần</SelectItem>
              <SelectItem value="price-desc">Giá giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 md:px-0">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} formatPrice={formatPrice} />
          </div>
        ))}
      </div>

      {/* Sentinel + Loading */}
      <div ref={sentinelRef} className="h-4" />
      <div className="flex justify-center py-4">
        {loading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        {!hasMore && products.length > 0 && !loading && (
          <span className="text-sm text-muted-foreground">
            Đã hiển thị tất cả sản phẩm
          </span>
        )}
      </div>
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';
export default ProductGrid;
