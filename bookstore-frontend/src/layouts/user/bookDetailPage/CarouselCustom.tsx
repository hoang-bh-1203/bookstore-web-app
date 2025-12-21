import type { Book } from '@/constants/interfaces.ts';
import BookCard from './BookCard.tsx';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'; // Use Shadcn Carousel
import type { CarouselApi } from '@/components/ui/carousel';

interface CarouselCustomProps {
  books: Book[];
  columns: number;
  rows: number;
}

export default function CarouselCustom({
  books,
  columns,
  rows,
}: CarouselCustomProps) {
  const itemsPerPage = columns * rows;
  const totalPages = Math.ceil(books.length / itemsPerPage);

  // We still need to track the current page for the custom indicators
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentIndex(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {/* Keep the pagination logic, but wrap in CarouselItem */}
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const start = pageIndex * itemsPerPage;
            const pageBooks = books.slice(start, start + itemsPerPage);

            return (
              <CarouselItem key={pageIndex}>
                <div
                  className="grid gap-0 w-full"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {pageBooks.map((book) => (
                    <div key={book.id} className="overflow-hidden p-2">
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Use Shadcn native buttons */}
        {currentIndex > 0 && <CarouselPrevious className="absolute left-1" />}
        {currentIndex < totalPages - 1 && (
          <CarouselNext className="absolute right-1" />
        )}
      </Carousel>

      {/* Indicators logic remains, but driven by the Carousel's state */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-[24px] h-[2px] mb-3 rounded transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
