import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CustomBreadcrumb from '@/components/common/breadcrumb';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, Bell, FileText, Menu, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const breadcrumbItems = useMemo(() => {
    const currentPath = location.pathname;
    let dynamicTitle = 'Thông tin tài khoản'; // Default

    if (currentPath.includes('/account-info'))
      dynamicTitle = 'Thông tin tài khoản';
    else if (currentPath.includes('/notifications'))
      dynamicTitle = 'Thông báo của tôi';
    else if (currentPath.includes('/orders')) dynamicTitle = 'Đơn hàng của tôi';

    return [
      { title: 'Trang chủ', href: '/' },
      { title: dynamicTitle, href: currentPath },
    ];
  }, [location.pathname]);

  const menuItems = [
    { icon: User, label: 'Thông tin tài khoản', href: '/account/info' },
    { icon: Bell, label: 'Thông báo của tôi', href: '/account/notifications' },
    { icon: FileText, label: 'Quản lý đơn hàng', href: '/account/orders' },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user?.avatarUrl || undefined}
            alt={user?.fullName}
          />
          <AvatarFallback>
            <UserCircle2 className="h-8 w-8 text-muted-foreground/50" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Tài khoản của</span>
          <span className="font-semibold text-foreground">
            {user?.fullName || 'Người dùng'}
          </span>
        </div>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => setIsSheetOpen(false)} // Close sheet on mobile click
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/15'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-8 bg-muted/30">
      <div className="flex-1">
        <CustomBreadcrumb items={breadcrumbItems} />
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Sidebar Desktop */}
            <aside className="hidden md:block w-64 shrink-0 bg-background rounded-lg border shadow-sm h-fit sticky top-20">
              <SidebarContent />
            </aside>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden mb-4">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Menu className="h-4 w-4" /> Menu tài khoản
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Main content area */}
            <main className="flex-1 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
