export function RecommendedProductsSection() {
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Sách Hay ${i + 1}`,
    price: `${100 + i * 10}.000đ`,
    rating: 4.5 + Math.random() * 0.5,
    image: `/placeholder.svg?height=200&width=150&query=book${i}`,
  }));

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Dành mua sắn phẩm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-xs">{product.rating.toFixed(1)}</span>
                </div>
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
