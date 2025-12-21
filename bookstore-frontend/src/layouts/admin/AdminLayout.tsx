import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminFooter from './AdminFooter';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AdminLayout() {
  // 1. Toàn bộ logic state được giữ nguyên 100%
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar collapsed={collapsed} />
      <main
        className={cn(
          'flex flex-col flex-1 transition-all duration-200',
          collapsed ? 'ml-20' : 'ml-[250px]',
        )}
      >
        <AdminHeader collapsed={collapsed} onToggle={toggleSidebar} />

        <div className="flex-1 p-4 md:p-6">
          <div className="p-6 bg-background rounded-lg shadow-sm">
            <Outlet />
          </div>
        </div>

        <AdminFooter />
      </main>
    </div>
  );
}
