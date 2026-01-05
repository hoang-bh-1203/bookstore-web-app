export function CategoryIcons() {
  const categories = [
    { icon: '📚', label: 'Sách' },
    { icon: '📖', label: 'Truyện' },
    { icon: '✏️', label: 'Văn Phòng' },
    { icon: '🎓', label: 'Giáo Dục' },
    { icon: '🎨', label: 'Nghệ Thuật' },
    { icon: '👶', label: 'Thiếu Nhi' },
    { icon: '💼', label: 'Kinh Doanh' },
    { icon: '🌟', label: 'Bán Chạy' },
  ];

  return (
    <div className="bg-white py-6 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-70"
            >
              <div className="text-3xl">{cat.icon}</div>
              <span className="text-xs text-center font-medium">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
