import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ShippingAddress() {
  const navigation = useNavigate();
  // Nên dùng hook useAuth() thay vì localStorage trực tiếp nếu có thể
  // để đảm bảo đồng bộ state.
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const onClick = () => {
    navigation('/profile');
  };

  return (
    <div className="rounded-lg p-4 bg-background border shadow-sm">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-muted-foreground text-sm font-medium">
          Giao tới
        </span>
        <Button
          variant="link"
          onClick={onClick}
          className="p-0 h-auto text-primary"
        >
          Thay đổi
        </Button>
      </div>

      {/* Tên + SĐT */}
      <div className="flex items-center text-base font-semibold mb-2">
        <span>{user?.fullName || '-'}</span>
        <span className="mx-2 text-muted-foreground">|</span>
        <span>{user?.phone || '-'}</span>
      </div>

      {/* Địa chỉ */}
      <div className="text-sm flex items-start gap-2">
        <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
          VĂN PHÒNG
        </span>
        <span className="text-foreground">{user?.address || '-'}</span>
      </div>
    </div>
  );
}
