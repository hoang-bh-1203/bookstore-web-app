import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NoProductsFoundProps {
  keyword: string;
  onClearSearch?: () => void;
  onRetry?: () => void;
}

const NoProductsFound: React.FC<NoProductsFoundProps> = ({ keyword }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20 max-w-md mx-auto px-4 flex flex-col items-center">
      <div className="mb-6 text-muted-foreground">
        <SearchX className="h-24 w-24 opacity-20" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Không tìm thấy sản phẩm
      </h2>
      <p className="text-muted-foreground mb-8">
        Không có sản phẩm nào phù hợp với từ khóa{' '}
        <span className="font-semibold text-foreground px-2 py-1 rounded-md bg-muted">
          "{keyword}"
        </span>
      </p>
      <Button size="lg" onClick={() => navigate('/')}>
        Trang chủ
      </Button>
    </div>
  );
};

export default NoProductsFound;
