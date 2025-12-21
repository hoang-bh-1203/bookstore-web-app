import type { Book } from '@/constants/interfaces.ts';
import { useEffect, useState } from 'react';
import { useBook } from '@/hooks/useBook.ts';
import CarouselCustom from './CarouselCustom';
import { useMediaQuery } from 'react-responsive';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TopDeals() {
  const [books, setBooks] = useState<Book[]>([]);
  const { getTopSellingBooks } = useBook();
  const isLg = useMediaQuery({ minWidth: 1024 });
  const isMd = useMediaQuery({ minWidth: 768 });

  // Logic remains identical
  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getTopSellingBooks();
      setBooks(data);
    };
    fetchBooks();
  }, [getTopSellingBooks]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Top Deals</CardTitle>
      </CardHeader>
      <CardContent>
        <CarouselCustom
          books={books}
          columns={isLg ? 4 : isMd ? 3 : 2}
          rows={1}
        />
      </CardContent>
    </Card>
  );
}
