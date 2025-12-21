// components/TopBestSellerBook.tsx

import { Link } from 'react-router-dom';
import { useBook } from '@/hooks/useBook.ts';
import { useEffect, useState } from 'react';
import type { Book } from '@/constants/interfaces.ts';
import { formattedPrice } from '@/utils/priceHelper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TopBestSellerBook() {
  const { getTopSellingBooks } = useBook();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchTopSellingBooks = async () => {
      try {
        const result = await getTopSellingBooks();
        setBooks(result);
      } catch (error) {
        console.error('Failed to fetch top selling books:', error);
      }
    };

    fetchTopSellingBooks();
    // Removed .then() as it wasn't doing anything critical
  }, [getTopSellingBooks]);

  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle className="text-xl">
          Top Bán Chạy Sản Phẩm Nhà Sách BS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal pl-6 flex flex-col gap-2.5">
          {books.map((book) => (
            <li key={book.id}>
              <Link
                to={`/books/${book.id}`}
                className="flex gap-2.5 text-sm items-center"
              >
                <span className="text-primary font-medium hover:underline">
                  {book.name}
                </span>
                <div className="flex-1"></div>
                <span className="text-foreground font-medium">
                  {formattedPrice(book.listPrice)}
                  <sup>₫</sup>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
