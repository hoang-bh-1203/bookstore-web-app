import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

const bestsellers = [
  {
    id: 1,
    rank: 1,
    title: 'Tâm Lý Học Tội Phạm',
    author: 'Diệp Hồng Vũ',
    price: 99000,
    badge: 'Bán chạy #1',
    image: '/psychology-crime-book-cover.jpg',
  },
  {
    id: 2,
    rank: 2,
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    price: 79000,
    badge: 'Kinh điển',
    image: '/alchemist-book-cover.png',
  },
  {
    id: 3,
    rank: 3,
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
    author: 'Rosie Nguyễn',
    price: 85000,
    badge: 'Hot',
    image: '/youth-motivation-book-cover.jpg',
  },
];

export function BestsellerSection() {
  const { addToCart } = useCart();

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground text-balance leading-tight">
                Top sách bán chạy nhất tuần
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Những cuốn sách được độc giả tin tưởng và lựa chọn nhiều nhất.
                Cập nhật hàng tuần để bạn không bỏ lỡ xu hướng đọc mới nhất.
              </p>
            </div>

            <div className="space-y-4">
              {bestsellers.map((book) => (
                <Card
                  key={book.id}
                  className="group hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={book.image || '/placeholder.svg'}
                            alt={book.title}
                            className="h-24 w-18 object-cover rounded"
                          />
                          <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                            {book.rank}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {book.badge}
                          </Badge>
                          <h3 className="font-medium text-foreground line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {book.author}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-lg font-semibold text-secondary">
                            {book.price.toLocaleString('vi-VN')}đ
                          </span>
                          <Button
                            size="sm"
                            onClick={() =>
                              addToCart({
                                productId: book.id,
                                name: book.title,
                                thumbnailUrl: book.image,
                                price: book.price,
                                originalPrice: book.price, // Giả sử giá gốc bằng giá bán nếu không có discount
                                quantity: 1,
                              })
                            }
                          >
                            Thêm vào giỏ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Xem toàn bộ bảng xếp hạng
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted">
              <img
                src="/person-reading-books-in-cozy-library.jpg"
                alt="Người đọc sách"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-lg p-6 shadow-lg max-w-xs hidden sm:block">
              <p className="text-sm text-muted-foreground mb-2">
                Đánh giá từ độc giả
              </p>
              <p className="text-foreground italic leading-relaxed">
                "Những cuốn sách tuyệt vời đã thay đổi cách nhìn của tôi về cuộc
                sống"
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                — Minh Anh, Hà Nội
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
