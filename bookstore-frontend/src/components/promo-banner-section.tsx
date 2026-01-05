export function PromoBannerSection() {
  return (
    <div className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-orange-400 to-orange-300 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">VÙNG ĐỎ DOANH NHÂN</h2>
            <p className="text-sm mb-4">Khám phá sách kinh doanh hàng đầu</p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded font-bold hover:bg-gray-100">
              Xem ngay
            </button>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">SÁCH NƯỚC NGOÀI</h2>
            <p className="text-sm mb-4">Bộ sưu tập sách quốc tế độc quyền</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100">
              Khám phá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
