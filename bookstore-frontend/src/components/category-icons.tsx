import { useNavigate } from 'react-router-dom';

export function CategoryIcons() {
  const navigate = useNavigate();

  const categories = [
    { icon: '📖', label: 'Truyện', categoryId: 59 },
    { icon: '🌐', label: 'Ngoại Ngữ', categoryId: 53 },
    { icon: '📈', label: 'Kinh Tế', categoryId: 20 },
    { icon: '💻', label: 'Tin Học', categoryId: 38 },
    { icon: '🎭', label: 'Văn Hóa', categoryId: 67 },
    { icon: '☯️', label: 'Phong Thủy', categoryId: 108 },
    { icon: '⚽', label: 'Thể Thao', categoryId: 110 },
    { icon: '👶', label: 'Thiếu Nhi', categoryId: 24 },
  ];

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/category-products?category=${categoryId}`);
  };

  return (
    <div className="bg-white py-6 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => handleCategoryClick(cat.categoryId)}
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
