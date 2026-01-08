'use client';

import { ShoppingCart, Menu, Search, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth-modal';
import { useState } from 'react';
import logo from '@/assets/logo.png';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getLinkClass = (path: string) => {
    const baseClass =
      'text-sm font-medium transition-colors hover:text-secondary';
    // So sánh đường dẫn hiện tại với path của link
    // Sử dụng location.pathname === path để match chính xác
    const activeClass =
      location.pathname === path ? 'text-secondary' : 'text-muted-foreground';

    return `${baseClass} ${activeClass}`;
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-10" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={getLinkClass('/')}>
                Trang chủ
              </Link>
              <Link to="/products" className={getLinkClass('/products')}>
                Sản phẩm
              </Link>
              <Link to="#" className={getLinkClass('/bestseller')}>
                Bestseller
              </Link>
              <Link to="#" className={getLinkClass('/about')}>
                Về chúng tôi
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
                <span className="sr-only">Tìm kiếm</span>
              </Button>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-xs flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Giỏ hàng</span>
                </Button>
              </Link>
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/account">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="max-w-[100px] truncate">
                        {user?.fullName || user?.email}
                      </span>
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="icon"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Đăng nhập
                </Button>
              )}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
