// layouts/user/Header.tsx

import logo from '@/assets/logo.png';
import commitment from '@/assets/commitment.svg';
import ticket from '@/assets/ticket.svg';
import fastDelivery from '@/assets/fast-shipping.svg';
import shipping from '@/assets/shipping.svg';
import refund from '@/assets/refund.svg';
import returnPolicy from '@/assets/return.svg';

import { Home, LogOut, Search, User } from 'lucide-react'; // Lucide Icons
import { Link, useNavigate } from 'react-router-dom';
import CartWithBadge from '@/components/common/card-with-badge';
import { LoginModal } from '@/components/forms/login-modal-form';
import { useModal } from '@/hooks/useModal';
import { SignupModal } from '@/components/forms/signup-modal-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const suggestions = [
    'điện gia dụng',
    'xe cộ',
    'mẹ & bé',
    'khỏe đẹp',
    'nhà cửa',
    'sách',
    'potter',
    'lịch treo tường 2024',
    'nguyễn nhật ánh',
  ];

  const { openLoginModal } = useModal();
  const { user, isAuthenticated, logout } = useAuth();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <header className="flex-col shadow-sm w-full hidden lg:flex bg-white">
      <div className="container mx-auto flex justify-between px-4 md:px-6 lg:px-8 py-4 w-full max-w-7xl">
        <Link to="/" className="flex items-center flex-shrink-0 mr-8">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>

        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-2xl border-2 border-blue-100 rounded-lg overflow-hidden focus-within:border-blue-400 transition-colors">
              <div className="flex items-center w-full bg-white">
                <Search className="text-gray-400 ml-3 h-5 w-5" />
                <input
                  type="text"
                  placeholder="100% hàng thật, freeship, hoàn tiền 200%"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 outline-none text-sm px-3 py-2.5 placeholder-gray-400"
                />
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <button
                  type="submit"
                  onClick={handleSearch}
                  className="text-blue-600 text-sm font-medium px-4 py-2.5 hover:bg-blue-50 transition-colors"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-2 xl:gap-6">
              <Link to="/">
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2"
                >
                  <Home className="h-5 w-5" />
                  Trang chủ
                </Button>
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-gray-100 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatarUrl!}
                          alt={user?.fullName}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden xl:block">
                        {user?.fullName}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => navigate('/profile')}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  onClick={openLoginModal}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 gap-2"
                >
                  <User className="h-5 w-5" />
                  Tài khoản
                </Button>
              )}

              <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

              <Link to="/cart" className="flex items-center">
                <CartWithBadge />
              </Link>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            {suggestions.map((s, i) => (
              <Link
                key={i}
                to={`/search?keyword=${encodeURIComponent(s)}`}
                className="hover:text-blue-600 transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Commitment Bar */}
      <div className="border-t bg-gray-50/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 flex gap-4 py-2.5 text-xs xl:text-sm overflow-x-auto no-scrollbar">
          <div className="font-semibold text-blue-600 whitespace-nowrap flex items-center">
            Cam kết
          </div>
          <div className="h-4 w-[1px] bg-gray-300 self-center mx-2"></div>
          <div className="flex items-center whitespace-nowrap gap-1">
            <img src={commitment} alt="" className="h-5 w-5" />
            <span>100% hàng thật</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-300 self-center mx-2"></div>
          <div className="flex items-center whitespace-nowrap gap-1">
            <img src={shipping} alt="" className="h-5 w-5" />
            <span>Freeship mọi nơi</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-300 self-center mx-2"></div>
          <div className="flex items-center whitespace-nowrap gap-1">
            <img src={refund} alt="" className="h-5 w-5" />
            <span>Hoàn tiền 200%</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-300 self-center mx-2"></div>
          <div className="flex items-center whitespace-nowrap gap-1">
            <img src={returnPolicy} alt="" className="h-5 w-5" />
            <span>30 ngày đổi trả</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-300 self-center mx-2"></div>
          <div className="flex items-center whitespace-nowrap gap-1">
            <img src={fastDelivery} alt="" className="h-5 w-5" />
            <span>Giao hàng 2h</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-300 self-center mx-2"></div>
          <div className="flex items-center whitespace-nowrap gap-1">
            <img src={ticket} alt="" className="h-5 w-5" />
            <span>Giá siêu rẻ</span>
          </div>
        </div>
      </div>
      <LoginModal />
      <SignupModal />
    </header>
  );
};

export default Header;
