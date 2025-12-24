// layouts/user/book_detail_page/BookDescription.tsx

import type { Book } from '@/constants/interfaces.ts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookDescriptionProps {
  book: Book | undefined;
}

export default function BookDescription({ book }: BookDescriptionProps) {
  const description = book?.description || 'Không có dữ liệu';
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-md font-semibold mb-0">Mô tả chi tiết</p>
      </div>
      <div
        className={cn(
          'relative overflow-hidden transition-all duration-300 text-sm',
          expanded ? 'max-h-none' : 'max-h-[250px]',
        )}
      >
        <div dangerouslySetInnerHTML={{ __html: description }} />

        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setExpanded(!expanded)}
          className="border-none shadow-none hover:bg-transparent hover:underline hover:cursor-pointer"
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </Button>
      </div>
    </div>
  );
}
