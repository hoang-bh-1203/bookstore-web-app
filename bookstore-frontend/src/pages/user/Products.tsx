import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  'Tất cả',
  'Văn học',
  'Kinh tế',
  'Tâm lý',
  'Kỹ năng',
  'Thiếu nhi',
  'Triết học',
];

const products = [
  {
    id: 1,
    title: 'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm',
    author: 'Mark Manson',
    price: 89000,
    originalPrice: 120000,
    image: '/book-cover-art-philosophy.jpg',
    category: 'Tâm lý',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Sapiens: Lược Sử Loài Người',
    author: 'Yuval Noah Harari',
    price: 189000,
    originalPrice: 250000,
    image: '/book-cover-history.jpg',
    category: 'Lịch sử',
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    price: 79000,
    originalPrice: 100000,
    image: '/book-cover-psychology.jpg',
    category: 'Kỹ năng',
    rating: 4.7,
  },
  {
    id: 4,
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    price: 69000,
    originalPrice: 95000,
    image: '/book-cover-fiction.jpg',
    category: 'Văn học',
    rating: 4.6,
  },
  {
    id: 5,
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    author: 'Rosie Nguyễn',
    price: 85000,
    originalPrice: 110000,
    image: '/book-cover-youth.jpg',
    category: 'Kỹ năng',
    rating: 4.5,
  },
  {
    id: 6,
    title: 'Tư Duy Nhanh Và Chậm',
    author: 'Daniel Kahneman',
    price: 159000,
    originalPrice: 200000,
    image: '/book-cover-thinking.jpg',
    category: 'Tâm lý',
    rating: 4.8,
  },
  {
    id: 7,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 129000,
    originalPrice: 165000,
    image: '/book-cover-habits.jpg',
    category: 'Kỹ năng',
    rating: 4.9,
  },
  {
    id: 8,
    title: 'Cà Phê Cùng Tony',
    author: 'Tony Buổi Sáng',
    price: 75000,
    originalPrice: 95000,
    image: '/book-cover-coffee.jpg',
    category: 'Kỹ năng',
    rating: 4.4,
  },
];

interface FilterSidebarProps {
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
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  resetFilters,
}: FilterSidebarProps) => (
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
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h3 className="font-semibold text-foreground mb-3">Khoảng giá</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Từ"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
            className="w-full"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Đến"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
            className="w-full"
          />
        </div>
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
    <Button
      variant="outline"
      className="w-full bg-transparent"
      onClick={resetFilters}
    >
      <X className="h-4 w-4 mr-2" />
      Xóa bộ lọc
    </Button>
  </div>
);

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Tất cả' || product.category === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating =
      selectedRating === 0 || product.rating >= selectedRating;
    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      case 'name-asc':
        return a.title.localeCompare(b.title, 'vi');
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setSelectedCategory('Tất cả');
    setSearchQuery('');
    setPriceRange([0, 300000]);
    setSelectedRating(0);
    setSortBy('default');
  };

  const sidebarProps = {
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
                {/* Mobile Filter Button and Results */}
                <div className="flex items-center justify-between mb-6 gap-4">
                  <p className="text-sm text-muted-foreground">
                    Hiển thị {sortedProducts.length} sản phẩm
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
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">
                      Không tìm thấy sản phẩm nào
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
