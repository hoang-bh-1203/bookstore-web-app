import { Button } from '@/components/ui/button';
import { ShieldBan, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Error403() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <ShieldBan className="h-24 w-24 text-red-500 opacity-80" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Truy cập bị từ chối
        </h2>
        <p className="text-muted-foreground mb-8">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
          viên nếu bạn cho rằng đây là lỗi.
        </p>
        <Button size="lg" onClick={() => navigate('/')} className="gap-2">
          <Home className="h-4 w-4" />
          Quay về trang chủ
        </Button>
        <div className="text-xs text-muted-foreground mt-8">
          Mã lỗi: 403 - Forbidden Access
        </div>
      </div>
    </div>
  );
}
