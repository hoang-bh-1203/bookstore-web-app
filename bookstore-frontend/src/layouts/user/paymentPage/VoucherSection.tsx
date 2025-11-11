import { Button } from '@/components/ui/button';
import { Info, ChevronRight, Tag } from 'lucide-react';

export default function VoucherSection() {
  return (
    <div className="flex flex-col gap-4 bg-background rounded-lg p-4 border shadow-sm">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center">
        <span className="font-medium">Tiki Khuyến Mãi</span>
        <span className="text-muted-foreground text-sm flex items-center gap-1">
          Có thể chọn 2
          <Info className="h-4 w-4" />
        </span>
      </div>

      {/* Voucher */}
      <div className="flex items-center overflow-hidden rounded-lg border">
        <div className="relative w-full">
          {/* SVG nền giả lập bằng div với background color/image nếu cần,
              hoặc giữ nguyên thẻ img nếu đó là asset của bạn */}
          <div className="h-[60px] w-full bg-blue-50 flex items-center px-3 relative">
            <div className="flex items-center justify-center mr-3">
              <img
                src="/src/assets/freeship-car.svg" // Đảm bảo đường dẫn đúng
                alt="freeship"
                className="w-10 h-10"
              />
            </div>
            <div className="flex-1 flex items-center">
              <div className="font-medium text-primary flex-1">Giảm 25K</div>
              <Info className="h-4 w-4 text-primary ml-2 cursor-pointer" />
            </div>
            <Button size="sm" className="ml-4">
              Bỏ Chọn
            </Button>
          </div>
        </div>
      </div>

      {/* Link chọn mã khác */}
      <div className="flex items-center text-primary cursor-pointer hover:underline">
        <Tag className="h-4 w-4 mr-2" />
        <div className="text-sm font-medium flex-1">Chọn hoặc nhập mã khác</div>
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
}
