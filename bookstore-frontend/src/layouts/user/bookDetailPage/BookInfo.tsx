import type { Book } from '@/constants/interfaces';
import { formattedPrice } from '@/utils/priceHelper.ts';
import { Star, StarHalf } from 'lucide-react'; // For custom rating

interface BookInfoProps {
  book: Book | undefined;
}

// Custom simple rating component to replace antd.Rate
function CustomRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 text-yellow-400 fill-yellow-400"
        />
      ))}
      {halfStar === 1 && (
        <StarHalf className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-gray-300 fill-gray-300"
        />
      ))}
    </div>
  );
}

export default function BookInfo({ book }: BookInfoProps) {
  const authors = book?.authors || [];
  const title = book?.name || '';
  const listPrice = book?.listPrice || 0;
  const originalPrice = book?.originalPrice || 0;
  const ratingAverage = book?.ratingAverage || 0.0;

  const discount =
    originalPrice > 0 && listPrice < originalPrice
      ? Math.floor(((originalPrice - listPrice) / originalPrice) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Replaced Typography.Text with <p> */}
      <p>
        {'Tác giả: '}
        {authors.length > 0
          ? authors.map((author, index) => (
              <span key={author.id || index}>
                {author.name ? (
                  <a
                    href="" // Assuming a link structure
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {author.name}
                  </a>
                ) : (
                  author.name
                )}
                {index < authors.length - 1 && (
                  <span className="text-primary">, </span>
                )}
              </span>
            ))
          : 'Không rõ tác giả'}
      </p>

      {/* Tiêu đề */}
      <h1 className="text-xl font-medium mb-0">{title}</h1>

      {/* Rating (Replaced antd.Rate) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-black">{ratingAverage.toFixed(1)}</span>
        <CustomRating rating={ratingAverage} />
      </div>

      {/* Price & discount */}
      <div className="flex items-center gap-2">
        <span className="text-destructive text-2xl font-bold">
          {formattedPrice(listPrice)}
          <sup>₫</sup>
        </span>
        {originalPrice > 0 && (
          <>
            {discount > 0 && (
              <span className="text-foreground font-semibold bg-muted rounded-full px-2 py-1 text-xs">
                -{discount}%
              </span>
            )}
            <span className="line-through text-muted-foreground text-sm">
              {formattedPrice(originalPrice)}
              <sup>₫</sup>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
