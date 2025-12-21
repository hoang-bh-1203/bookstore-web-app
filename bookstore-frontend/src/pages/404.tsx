import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <HelpCircle className="h-24 w-24 text-orange-500 opacity-80" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Không tìm thấy trang
        </h2>
        <p className="text-muted-foreground mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Vui lòng
          kiểm tra lại đường dẫn.
        </p>
        <Button size="lg" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="text-xs text-muted-foreground mt-8">
          Mã lỗi: 404 - Page Not Found
        </div>
      </div>
    </div>
  );
}
