export function SeasonalSection() {
  const products = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Sách Lễ Hội ${i + 1}`,
    price: `${150 + i * 20}.000đ`,
    image: `/placeholder.svg?height=200&width=150&query=halloween${i}`,
  }));

  return (
    <div className="bg-gradient-to-r from-orange-400 to-yellow-300 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-white">🎃 LỄ HỘI MA QUỶ</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
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
