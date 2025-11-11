import type React from 'react';

const PaymentFooter: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t py-6 px-4 mt-auto">
      <div className="container mx-auto max-w-7xl">
        {/* Disclaimer text */}
        <div className="mb-4">
          <p className="text-sm text-foreground leading-relaxed">
            Bằng việc tiến hành Đặt Mua, bạn đồng ý với các Điều kiện Giao dịch
            chung:
          </p>
        </div>

        {/* Policy links */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              'Quy chế hoạt động',
              'Chính sách giải quyết khiếu nại',
              'Chính sách bảo hành',
              'Chính sách bảo mật thanh toán',
              'Chính sách bảo mật thông tin cá nhân',
            ].map((text, index) => (
              <a
                key={index}
                href="#"
                className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 whitespace-nowrap"
              >
                {text}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} - Bản quyền của Công Ty Cổ Phần TIKI -
            Tiki.vn
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PaymentFooter;
