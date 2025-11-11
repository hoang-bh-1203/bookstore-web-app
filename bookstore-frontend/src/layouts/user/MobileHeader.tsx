import type React from 'react';
import { Input } from '@/components/ui/input'; // Shadcn Input
import { Menu, Search, Gift, ChevronRight, ChevronLeft } from 'lucide-react'; // Lucide Icons
import CartWithBadge from '@/components/common/card-with-badge';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MobileSidebar from './MobileSidebar';
import { Button } from '@/components/ui/button';

const MobileHeader: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
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
    <div className="w-full lg:hidden bg-slate-100 sticky top-0 z-50">
      {/* Main Header */}
      <div className="bg-blue-500 px-4 py-3 flex items-center gap-3">
        {/* Back Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-blue-600/50 h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Menu Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-blue-600/50 h-8 w-8"
          onClick={() => setOpenMenu(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Bạn đang tìm kiếm gì"
            className="w-full bg-white pl-8 border-0 h-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Shopping Cart */}
        <div className="text-white">
          <CartWithBadge />
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-yellow-100 px-4 py-2.5 mx-4 mt-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-yellow-200 transition-colors border border-yellow-200">
        <div className="flex items-center gap-2">
          <Gift className="text-blue-600 h-5 w-5" />
          <span className="text-sm text-gray-800 font-medium">
            <span className="text-blue-600 font-bold">30 NGÀY</span> đổi ý &
            miễn phí trả hàng
          </span>
        </div>
        <ChevronRight className="text-gray-500 h-4 w-4" />
      </div>

      <MobileSidebar isOpen={openMenu} onClose={setOpenMenu} />
    </div>
  );
};

export default MobileHeader;
