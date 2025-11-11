// layouts/user/MobileSidebar.tsx

import { Home, ShoppingCart, User, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      key: '/',
      icon: <Home className="h-5 w-5" />,
      label: 'Trang chủ',
      href: '/',
    },
    {
      key: '/cart',
      icon: <ShoppingCart className="h-5 w-5" />,
      label: 'Giỏ hàng',
      href: '/cart',
    },
    {
      key: '/profile',
      icon: <User className="h-5 w-5" />,
      label: 'Trang cá nhân',
      href: '/profile',
    },
    {
      key: '/profile/orders', // Sửa lại key cho khớp href để logic active hoạt động đúng
      icon: <FileText className="h-5 w-5" />,
      label: 'Đơn hàng',
      href: '/profile/orders',
    },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        {/* Navigation Menu tùy chỉnh thay cho antd.Menu */}
        <div className="flex-1 py-2">
          <nav className="flex flex-col space-y-1 px-2">
            {navigationItems.map((item) => {
              // Logic kiểm tra active đơn giản
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));

              return (
                <Button
                  key={item.key}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 font-normal',
                    isActive && 'font-medium',
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        <SheetFooter className="p-4 border-t mt-auto sm:justify-center">
          <p className="text-xs text-muted-foreground text-center w-full">
            Phiên bản 1.0.0
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
