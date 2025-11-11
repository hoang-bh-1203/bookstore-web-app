import type { Book } from '@/constants/interfaces.ts';
import { formattedPrice } from '@/utils/priceHelper.ts';

interface BookPaymentCardProps {
  book: Book;
  quantity: number;
}

export default function BookPaymentCard({
  book,
  quantity,
}: BookPaymentCardProps) {
  return (
    <div className="flex gap-3 w-full md:w-3/4 lg:w-2/4 py-2 border-b last:border-0">
      <div className="w-12 h-12 flex-shrink-0 border rounded-md overflow-hidden bg-white flex items-center justify-center">
        <img
          src={book.images[0]?.baseUrl || ''}
          alt={book.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="text-sm font-medium line-clamp-2" title={book.name}>
          {book.name}
        </div>
        <div className="flex items-center text-sm mt-1">
          <div className="text-muted-foreground">SL: x{quantity}</div>
          <div className="flex-1" />
          <div className="text-muted-foreground line-through text-xs mr-2">
            {formattedPrice(quantity * book.originalPrice)} ₫
          </div>
          <div className="text-destructive font-medium">
            {formattedPrice(quantity * book.listPrice)} ₫
          </div>
        </div>
      </div>
    </div>
  );
}
