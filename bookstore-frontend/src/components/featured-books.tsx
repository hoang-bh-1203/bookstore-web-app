import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './product-card';

const featuredBooks = [
  {
    id: 1,
    title: 'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm',
    author: 'Mark Manson',
    price: 89000,
    originalPrice: 120000,
    rating: 4.8,
    reviews: 234,
    image: '/book-cover-art-philosophy.jpg',
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 95000,
    originalPrice: 130000,
    rating: 4.9,
    reviews: 456,
    image: '/atomic-habits-cover.png',
  },
  {
    id: 3,
    title: 'Sapiens: Lược Sử Loài Người',
    author: 'Yuval Noah Harari',
    price: 125000,
    originalPrice: 165000,
    rating: 4.7,
    reviews: 189,
    image: '/sapiens-book-cover-history.jpg',
  },
  {
    id: 4,
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    price: 75000,
    originalPrice: 100000,
    rating: 4.6,
    reviews: 567,
    image: '/how-to-win-friends-book-cover.png',
  },
];

export function FeaturedBooks() {
  return (
    <section className="sm:py-24 flex-grow container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground text-balance">
              Sách nổi bật
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Những cuốn sách được yêu thích nhất trong tháng
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:inline-flex">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredBooks.map((book) => (
            <ProductCard key={book.id} product={book} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            Xem tất cả sách nổi bật
          </Button>
        </div>
      </div>
    </section>
  );
}
