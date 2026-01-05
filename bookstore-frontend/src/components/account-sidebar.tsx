import { Link, useLocation } from 'react-router-dom';
import { User, Bell, Package } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function AccountSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    {
      label: 'Thông tin tài khoản',
      href: '/account',
      icon: User,
    },
    {
      label: 'Thông báo của tôi',
      href: '/account/notifications',
      icon: Bell,
    },
    {
      label: 'Quản lý đơn hàng',
      href: '/account/orders',
      icon: Package,
    },
  ];

  return (
    <div className="w-64 flex-shrink-0">
      {/* Account Header */}
      <div className="bg-card rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Vũ" />
            <AvatarFallback>VT</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Tài khoản của</p>
            <p className="font-semibold text-foreground">Vũ Anh Tú</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-lg overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-6 py-4 border-b last:border-b-0 transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-4 border-l-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
