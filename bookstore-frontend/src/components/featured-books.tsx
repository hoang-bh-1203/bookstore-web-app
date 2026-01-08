import { Button } from '@/components/ui/button';
import type { Book } from '@/constants/interfaces';
import { useBook } from '@/hooks/useBook';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductCard } from './product-card';

export function FeaturedBooks() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllBooks } = useBook();

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        setLoading(true);
        const response = await getAllBooks({
          page: 0,
          size: 4,
          sort: 'id,desc'
        });
        setFeaturedBooks(response.data || []);
      } catch (error) {
        console.error('Error fetching latest books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, [getAllBooks]);

  if (loading) {
    return (
      <section className="sm:py-24 flex-grow container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">Đang tải...</p>
        </div>
      </section>
    );
  }
  return (
    <section className="sm:py-24 flex-grow container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground text-balance">
              Sách Mới Cập Nhật
            </h2>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Những cuốn sách cập nhập gần đây
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:inline-flex">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredBooks.map((book) => (
            <ProductCard 
              key={book.id} 
              product={{
                ...book,
                title: book.name,
                author: book.authors?.map(a => a.name).join(', ') || '',
                image: book.images[0]?.imageUrl || ''
              }} 
            />
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
