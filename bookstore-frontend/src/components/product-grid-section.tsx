interface ProductGridSectionProps {
  title: string;
  category: string;
}

export function ProductGridSection({
  title,
  category,
}: ProductGridSectionProps) {
  const products = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `${title} - Sản phẩm ${i + 1}`,
    price: `${120 + i * 15}.000đ`,
    discount: `-${20 + i * 5}%`,
    image: `/placeholder.svg?height=200&width=150&query=${category}${i}`,
  }));

  return (
    <div className="bg-white py-8 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <a href="/products" className="text-red-600 hover:underline">
            Xem tất cả →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
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
                <p className="text-red-600 font-bold text-sm">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
