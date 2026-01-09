import type { Book } from '@/constants/interfaces.ts';
import { useEffect, useState } from 'react';
import { useBook } from '@/hooks/useBook.ts';
import CarouselCustom from './CarouselCustom';
import { useMediaQuery } from 'react-responsive';

interface SimilarProductsProps {
  book: Book | undefined;
}

export default function SimilarProducts({ book }: SimilarProductsProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const { getSimilarBooks } = useBook();
  const isLg = useMediaQuery({ minWidth: 1024 });
  const isMd = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    const fetchSimilarBooks = async () => {
      if (!book?.id) return;

      try {
        const data = await getSimilarBooks(book.id);
        setBooks(data || []);
      } catch (error) {
        console.error('Error fetching similar books:', error);
        setBooks([]);
      }
    };

    fetchSimilarBooks();
  }, [book?.id, getSimilarBooks]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-md font-semibold mb-0">Sản phẩm tương tự</p>
      </div>
      <CarouselCustom
        books={books}
        columns={isLg ? 4 : isMd ? 3 : 2}
        rows={2}
      />
    </div>
  );
}
