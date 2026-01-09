// layouts/user/book_detail_page/BookCard.tsx

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import type { Book } from '@/constants/interfaces';
import { useNavigate } from 'react-router-dom';
import { formattedPrice } from '@/utils/priceHelper.ts';
import { useEffect, useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

interface BookCardProps {
  book: Book | undefined;
}

// Custom simple rating component to replace antd.Rate
function CustomRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center" style={{ fontSize: 12 }}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-3 w-3 text-yellow-400 fill-yellow-400"
        />
      ))}
      {halfStar === 1 && (
        <StarHalf className="h-3 w-3 text-yellow-400 fill-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-3 w-3 text-gray-300 fill-gray-300"
        />
      ))}
    </div>
  );
}

export default function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    setShowAd(Math.random() < 0.5);
  }, [book?.id]);

  const handleClick = () => {
    if (book?.id) {
      navigate(`/books/${book.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Card
      className="rounded-lg overflow-hidden hover:shadow-md transition-shadow border-[#EBEBF0] bg-white cursor-pointer h-full flex flex-col"
      onClick={handleClick}
    >
      <CardHeader className="p-0 relative">
        <div
          className="relative rounded-t-lg flex items-center justify-center bg-white"
          style={{ width: '100%', paddingTop: '100%', overflow: 'hidden' }} // Use aspect-ratio trick
        >
          <img
            src={book?.images?.[0]?.imageUrl || '/placeholder.svg'}
            alt={book?.name || 'Book'}
            className="absolute top-0 left-0 w-full h-full object-contain p-2"
          />
          {showAd && (
            <span className="absolute top-2 right-2 rounded-md bg-[#F5F5FA] border border-white text-[#27272A] text-[10px] font-bold px-2 py-[2px] uppercase">
              AD
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-2 flex flex-col flex-1">
        <h4 className="text-xs line-clamp-2">{book?.name || '-'}</h4>
      </CardContent>

      <CardFooter className="p-2 flex flex-col items-start">
        {(book?.ratingAvg || 0) > 0 && (
          <CustomRating rating={book?.ratingAvg || 0} />
        )}
        <div className="font-medium text-sm mt-1">
          {formattedPrice(book?.finalPrice || 0)}
          <sup>₫</sup>
        </div>
      </CardFooter>
    </Card>
  );
}
