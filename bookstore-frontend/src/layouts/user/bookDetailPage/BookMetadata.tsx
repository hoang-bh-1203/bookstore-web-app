import { Separator } from '@/components/ui/separator';
import type { Book } from '@/constants/interfaces.ts';

interface BookMetaDataProps {
  book: Book | undefined;
}

export default function BookMetadata({ book }: BookMetaDataProps) {
  const data = [
    { label: 'Bookcare', value: 'Có' },
    //{ label: 'Công ty phát hành', value: book?.publisher || '-' },
    { label: 'Ngày xuất bản', value: book?.publisherDate || '-' },
    { label: 'Kích thước', value: book?.dimension || '-' },
    //{ label: 'Dịch Giả', value: book?.   || '-' },
    //{ label: 'Loại bìa', value: book?.bookCover || '-' },
    { label: 'Số trang', value: book?.numberOfPages || '-' },
    { label: 'Nhà xuất bản', value: book?.publisher || '-' },
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
