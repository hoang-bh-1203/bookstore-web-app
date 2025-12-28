import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdminHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Admin header component with user dropdown and sidebar toggle
 * @param collapsed - Whether the sidebar is collapsed
 * @param onToggle - Callback to toggle sidebar state
 */
export default function AdminHeader({ collapsed, onToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // User dropdown menu configuration using Lucide icons
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogOut className="mr-2 h-4 w-4 text-destructive" />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  /**
   * Handles menu item click events
   * @param key - The menu item key that was clicked
   */
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'logout':
        logout();
        navigate('/admin/login');
        break;
      // Add more cases as needed
    }
  };

  return (
    <header className="px-4 h-16 bg-background border-b flex items-center justify-between">
      <div className="flex items-center">
        {/* Toggle button for sidebar collapse/expand */}
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
        <h2 className="text-lg font-semibold ml-4">Trang Quản Trị</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* User dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* User profile trigger */}
            <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl!} alt={user?.fullName} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">Quản trị viên</p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Map through menu items and handle clicks */}
            {userMenuItems.map((item) => (
              <DropdownMenuItem
                key={item.key}
                // Use onSelect callback to trigger menu action handler
                onSelect={() => handleMenuClick({ key: item.key })}
                className={cn(
                  'cursor-pointer',
                  // Apply destructive styles for dangerous actions
                  item.danger &&
                    'text-destructive focus:text-destructive focus:bg-destructive/10',
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
