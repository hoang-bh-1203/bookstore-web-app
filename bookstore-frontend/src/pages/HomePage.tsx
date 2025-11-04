interface Product {
  id: number;
  title: string;
  author?: string;
  price: string;
  image: string;
}

const sampleProducts: Product[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: `Sample Book ${i + 1}`,
  author: `Author ${i + 1}`,
  price: `${(99 - i).toLocaleString()} VND`,
  image: `https://picsum.photos/seed/book-${i + 1}/400/600`,
}));

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero section with search and category buttons */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold">
                Mua sách trực tuyến — Giao nhanh trong ngày
              </h1>
              <p className="mt-2 text-gray-600">
                Hàng ngàn đầu sách, ưu đãi hấp dẫn và dịch vụ tận tâm.
              </p>

              <form className="mt-6">
                <div className="flex gap-2">
                  <input
                    aria-label="search"
                    placeholder="Tìm sách, tác giả, thể loại..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>

              <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  'Sách mới',
                  'Tiểu thuyết',
                  'Thiếu nhi',
                  'Kỹ năng sống',
                  'Học ngoại ngữ',
                  'Giảm giá',
                ].map((c) => (
                  <button
                    key={c}
                    className="text-sm px-3 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/3">
              <img
                src="https://picsum.photos/seed/hero/560/360"
                alt="hero"
                className="w-full h-44 object-cover rounded-md shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Promotional carousel section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold mb-4">Khuyến mãi nổi bật</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[280px] rounded-md bg-white shadow-sm overflow-hidden"
            >
              <img
                src={`https://picsum.photos/seed/promo-${i + 1}/640/300`}
                alt={`promo-${i}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold">Ưu đãi {i + 1}</h3>
                <p className="text-sm text-gray-600">
                  Áp dụng đến khi có thông báo
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best-selling books product grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sách bán chạy</h2>
          <a className="text-sm text-indigo-600 hover:underline">Xem tất cả</a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sampleProducts.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-md shadow-sm overflow-hidden flex flex-col"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-medium line-clamp-2">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{p.author}</p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-indigo-600">
                    {p.price}
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">
                    Thêm
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer with site information and links */}
      <footer className="bg-gray-900 text-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold">Fahasa - Mua sách</h4>
            <p className="text-sm text-gray-400 mt-2">
              Địa chỉ, liên hệ, giới thiệu ngắn.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Hỗ trợ</h4>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>Điều khoản</li>
              <li>Chính sách đổi trả</li>
              <li>Liên hệ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Dịch vụ</h4>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>Giao hàng nhanh</li>
              <li>Thanh toán</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Kết nối</h4>
            <div className="flex gap-2 mt-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                FB
              </div>
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                IG
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
          © 2025 Fahasa clone sample
        </div>
      </footer>
    </main>
  );
}
