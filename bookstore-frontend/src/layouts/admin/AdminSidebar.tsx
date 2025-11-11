import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  AppWindow,
  Users,
  ShoppingCart,
  ScrollText,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
}

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  children?: MenuItem[];
};

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems: MenuItem[] = [
    {
      key: '/admin',
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: 'Dashboard',
    },
    {
      key: '/admin/products',
      icon: <ShoppingBag className="h-4 w-4" />,
      label: 'Quản lý sản phẩm',
    },
    {
      key: '/admin/categories',
      icon: <AppWindow className="h-4 w-4" />,
      label: 'Quản lý danh mục',
    },
    {
      key: '/admin/users',
      icon: <Users className="h-4 w-4" />,
      label: 'Quản lý người dùng',
    },
    {
      key: 'orders',
      icon: <ShoppingCart className="h-4 w-4" />,
      label: 'Quản lý đơn hàng',
      children: [
        {
          key: '/admin/orders/statistics',
          icon: <ScrollText className="h-4 w-4" />,
          label: 'Thống kê đơn hàng',
        },
        {
          key: '/admin/orders',
          icon: <ScrollText className="h-4 w-4" />,
          label: 'Danh sách đơn hàng',
        },
      ],
    },
    {
      key: '/admin/profile',
      icon: <User className="h-4 w-4" />,
      label: 'Thông tin cá nhân',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const getSelectedKeys = () => {
    let selectedKey = '';
    for (const item of menuItems.flatMap((i) =>
      i.children ? i.children : i,
    )) {
      if (
        location.pathname.startsWith(item.key) &&
        item.key.length > selectedKey.length
      ) {
        selectedKey = item.key;
      }
    }
    return [selectedKey || location.pathname];
  };

  const getOpenKeys = () => {
    const openKeys: string[] = [];
    if (location.pathname.includes('/orders')) openKeys.push('orders');
    return openKeys;
  };

  const selectedKeys = getSelectedKeys();
  const defaultOpenKeys = getOpenKeys();

  const renderMenuItem = (item: MenuItem) => {
    const isActive = selectedKeys.includes(item.key);

    if (item.children) {
      return (
        <Collapsible
          key={item.key}
          defaultOpen={defaultOpenKeys.includes(item.key)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              {item.icon}
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="py-1">
            <div
              className={cn(
                'flex flex-col',
                collapsed ? 'items-center' : 'pl-8',
              )}
            >
              {item.children.map(renderMenuItem)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.key}
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start gap-2"
        onClick={() => handleMenuClick({ key: item.key })}
      >
        {item.icon}
        {!collapsed && <span>{item.label}</span>}
      </Button>
    );
  };

  return (
    <aside
      className={cn(
        'overflow-auto h-screen fixed left-0 top-0 bottom-0 z-10',
        'flex flex-col bg-card border-r transition-all duration-200',
        collapsed ? 'w-20' : 'w-[250px]',
      )}
    >
      <div className="h-16 flex items-center justify-center border-b shrink-0">
        <div
          className={`font-bold text-foreground ${
            collapsed ? 'text-base' : 'text-xl'
          }`}
        >
          {collapsed ? 'A' : 'ADMIN'}
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map(renderMenuItem)}
      </nav>
    </aside>
  );
}
