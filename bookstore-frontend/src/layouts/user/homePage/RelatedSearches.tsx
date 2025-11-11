// components/RelatedSearches.tsx

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const relatedSearches: string[] = [
  'harry potter trọn bộ',
  '999 lá thư gửi cho chính mình',
  'atomic habits',
  'roses and champagne',
  'đám trẻ ở đại dương đen',
  'tâm lý học về tiền',
  'tư duy nhanh và chậm',
  'dám bị ghét',
  'người bà tài giỏi vùng saga',
  'việt nam sử lược',
  'trốn lên mái nhà để khóc',
  'tội ác và hình phạt',
  'vẻ đẹp của sự cô đơn',
  'đúng việc',
  'triêu du',
  'tần số rung động',
  'đứa trẻ hiểu chuyện thường không có kẹo ăn',
  'con đường chẳng mấy ai đi',
];

export default function RelatedSearches() {
  return (
    <Card className="my-2">
      <CardHeader>
        <CardTitle className="text-xl">Tìm kiếm liên quan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-1">
          {relatedSearches.map((search, index) => (
            <Button
              key={index}
              variant="link"
              className="p-0 h-auto justify-start truncate"
              asChild // This passes the Button's props down to the Link
            >
              <Link to={''} className="font-normal">
                {search}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
