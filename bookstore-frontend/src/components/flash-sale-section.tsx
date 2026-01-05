export function FlashSaleSection() {
  const products = [
    {
      id: 1,
      name: 'Sách Hay Tháng Này',
      price: '75.000đ',
      discount: '-30%',
      image: '/open-book-library.png',
    },
    {
      id: 2,
      name: 'Truyện Tranh Nổi Tiếng',
      price: '45.000đ',
      discount: '-25%',
      image: '/comic-strip.png',
    },
    {
      id: 3,
      name: 'Sách Kinh Doanh',
      price: '120.000đ',
      discount: '-40%',
      image: '/business-meeting-diversity.png',
    },
    {
      id: 4,
      name: 'Tiểu Thuyết Hay',
      price: '85.000đ',
      discount: '-35%',
      image: '/open-novel.png',
    },
    {
      id: 5,
      name: 'Sách Tự Giáo Dục',
      price: '95.000đ',
      discount: '-28%',
      image: '/self-help.jpg',
    },
  ];

  return (
    <div className="bg-red-600 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">⚡ FLASH SALE</h2>
          <a href="/products" className="text-white hover:underline">
            Xem tất cả →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative">
                <img
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                  {product.discount}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-red-600 font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
