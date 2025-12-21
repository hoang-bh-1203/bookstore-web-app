import type { Book } from '@/constants/interfaces.ts';
import { Separator } from '@/components/ui/separator';

interface BookMetaDataProps {
  book: Book | undefined;
}

export default function BookMetadata({ book }: BookMetaDataProps) {
  const data = [
    { label: 'Bookcare', value: 'Có' },
    { label: 'Công ty phát hành', value: book?.publisherVn || '-' },
    { label: 'Ngày xuất bản', value: book?.publicationDate || '-' },
    { label: 'Kích thước', value: book?.dimensions || '-' },
    { label: 'Dịch Giả', value: book?.dichGia || '-' },
    { label: 'Loại bìa', value: book?.bookCover || '-' },
    { label: 'Số trang', value: book?.numberOfPage || '-' },
    { label: 'Nhà xuất bản', value: book?.manufacturer || '-' },
  ];

  return (
    <div>
      <div>
        <p className="text-md font-semibold mb-0">Thông tin chi tiết</p>
      </div>
      <div className="mt-2 flex flex-col">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex py-2">
              <div className="w-1/3 text-muted-foreground text-sm">
                {item.label}
              </div>
              <div className="w-2/3 text-sm">{item.value}</div>
            </div>
            {index < data.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}
