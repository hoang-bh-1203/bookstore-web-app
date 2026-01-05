export function PromoTopBanner() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold">
            🎁 DOANH NHÂN NƯỚC NGOÀI - SÁCH HAY DÙNG TRÍ
          </span>
          <span className="bg-yellow-400 text-red-600 px-2 py-1 rounded font-bold text-xs">
            50% MEGA SALE
          </span>
        </div>
        <a href="#" className="underline hover:opacity-80">
          Xem chi tiết
        </a>
      </div>
    </div>
  );
}
