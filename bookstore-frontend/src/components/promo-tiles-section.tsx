import { Button } from '@/components/ui/button';

export function PromoTilesSection() {
  const tiles = [
    {
      id: 1,
      title: 'Chiến Thắng',
      subtitle: 'Ngữ + Oán',
      discount: 'MUA NGAY',
      bgColor: 'bg-red-500',
      image: '/book-promo-1.jpg',
    },
    {
      id: 2,
      title: '20-10',
      subtitle: 'Mùng Lăng Lưới Cảnh',
      discount: 'MUA NGAY',
      bgColor: 'bg-orange-500',
      image: '/book-promo-2.jpg',
    },
    {
      id: 3,
      title: 'Vùng Ngoài Ngữ',
      subtitle: 'Vùng Bước Doanh Nhân',
      discount: 'GIẢM ĐẾN 34%',
      bgColor: 'bg-red-600',
      image: '/book-promo-3.jpg',
    },
    {
      id: 4,
      title: 'October',
      subtitle: 'Must-Read Picks',
      discount: 'MUA NGAY',
      bgColor: 'bg-orange-400',
      image: '/book-promo-4.jpg',
    },
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className={`${tile.bgColor} rounded-lg p-6 text-white flex flex-col justify-between min-h-64`}
            >
              <div>
                <h3 className="text-2xl font-bold mb-1">{tile.title}</h3>
                <p className="text-sm opacity-90">{tile.subtitle}</p>
              </div>

              <div className="flex items-end justify-between">
                <img
                  src={tile.image || '/placeholder.svg'}
                  alt={tile.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold"
                >
                  {tile.discount}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
