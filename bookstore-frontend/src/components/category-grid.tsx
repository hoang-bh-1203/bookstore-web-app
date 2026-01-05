export function CategoryGrid() {
  const categories = [
    { title: '20-10 SIÊU SALE', discount: 'Giảm đến 50%', color: 'bg-red-500' },
    { title: 'SÁCH NƯỚC NGOÀI', discount: 'Giảm 34%', color: 'bg-blue-500' },
    { title: 'DỊCH VỤ QUẢN LÝ', discount: 'Giảm 40%', color: 'bg-purple-500' },
    { title: 'SÁCH THIẾU NHI', discount: 'Giảm 30%', color: 'bg-pink-500' },
  ];

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`${cat.color} rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition`}
            >
              <h3 className="font-bold text-sm mb-1">{cat.title}</h3>
              <p className="text-xs">{cat.discount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
