import logo2 from '@/assets/bo-cong-thuong.svg';
import logo1 from '@/assets/bo-cong-thuong-2.svg';
import logo3 from '@/assets/bo-cong-thuong-3.svg';
import payment0 from '@/assets/payment-0.svg';
import payment1 from '@/assets/payment-1.svg';
import payment2 from '@/assets/payment-2.svg';
import payment3 from '@/assets/payment-3.svg';
import payment4 from '@/assets/payment-4.svg';
import payment5 from '@/assets/payment-5.svg';
import payment6 from '@/assets/payment-6.svg';
import payment7 from '@/assets/payment-7.svg';
import payment8 from '@/assets/payment-8.svg';
import payment9 from '@/assets/payment-9.svg';
import payment10 from '@/assets/payment-10.svg';
import appstore from '@/assets/appstore.svg';
import googleplay from '@/assets/googleplay.svg';
import zalo from '@/assets/zalo.svg';
import facebook from '@/assets/facebook.svg';
import youtube from '@/assets/youtube.svg';
import tikiQr from '@/assets/tiki-qr.svg';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Customer Support */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">
              Hỗ trợ Khách hàng
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Hotline: </span>
                <span className="text-primary font-medium">1900-6035</span>
              </div>
              <div className="text-xs">(1000 đ/phút, 8-21h kể cả T7, CN)</div>
              <ul className="space-y-1 mt-3">
                {[
                  'Các câu hỏi thường gặp',
                  'Gửi yêu cầu hỗ trợ',
                  'Hướng dẫn đặt hàng',
                  'Phương thức vận chuyển',
                  'Chính sách kiểm hàng',
                  'Chính sách đổi trả',
                  'Hướng dẫn trả góp',
                  'Chính sách hàng nhập khẩu',
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1">
                <div>
                  Hỗ trợ khách hàng:{' '}
                  <span className="text-primary">hotro@bs.vn</span>
                </div>
                <div>
                  Báo lỗi bảo mật:{' '}
                  <span className="text-primary">security@bs.vn</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">
              Về BS Bookstore
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                'Giới thiệu BS Bookstore',
                'BS Blog',
                'Tuyển dụng',
                'Chính sách bảo mật thanh toán',
                'Chính sách bảo mật thông tin cá nhân',
                'Chính sách giải quyết khiếu nại',
                'Điều khoản sử dụng',
                'Giới thiệu BS Xu',
                'Tiếp thị liên kết cùng BS',
                'Bán hàng doanh nghiệp',
                'Điều kiện vận chuyển',
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnership */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">
              Hợp tác và liên kết
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground mb-6">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Quy chế hoạt động Sàn GDTMDT
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Bán hàng cùng BS
                </a>
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mb-3">
              Chứng nhận bởi
            </h4>
            <div className="flex flex-wrap gap-2">
              <img src={logo1} alt="bct" className="h-8" />
              <img src={logo2} alt="bct" className="h-8" />
              <img src={logo3} alt="bct" className="h-8" />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">
              Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                payment0,
                payment1,
                payment2,
                payment3,
                payment4,
                payment5,
                payment6,
                payment7,
                payment8,
                payment9,
                payment10,
              ].map((payment, index) => (
                <img
                  key={index}
                  src={payment}
                  alt="payment"
                  className="max-w-[48px] w-full"
                />
              ))}
            </div>

            <h4 className="font-semibold text-foreground mb-3">
              Dịch vụ giao hàng
            </h4>
            <div className="text-primary font-bold text-lg">BSNOW</div>
          </div>

          {/* Connect with us */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-foreground mb-4">
              Kết nối với chúng tôi
            </h3>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-8 h-8 rounded-full overflow-hidden">
                <img src={facebook} alt="fb" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full overflow-hidden">
                <img src={youtube} alt="yt" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full overflow-hidden">
                <img src={zalo} alt="zalo" />
              </a>
            </div>

            <h4 className="font-semibold text-foreground mb-3">
              Tải ứng dụng trên điện thoại
            </h4>
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 rounded flex items-center justify-center overflow-hidden">
                <img
                  src={tikiQr}
                  alt="qr"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <div className="w-24 h-8 rounded flex items-center justify-center overflow-hidden">
                  <img
                    src={appstore}
                    alt="appstore"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="w-24 h-8 bg-black rounded flex items-center justify-center overflow-hidden">
                  <img
                    src={googleplay}
                    alt="googleplay"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="border-t pt-6 mb-6">
          <h3 className="font-semibold text-foreground mb-3">
            Công ty TNHH TI KI
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Tòa nhà số 52 đường Út Tịch, Phường 4, Quận Tân Bình, Thành phố Hồ
              Chí Minh
            </p>
            <p>
              Giấy chứng nhận đăng ký doanh nghiệp số 0309532909 do Sở Kế Hoạch
              và Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày 06/01/2010.
            </p>
            <p>
              Hotline: <span className="text-primary">1900 6035</span>
            </p>
          </div>
        </div>

        {/* Featured Brands */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-foreground mb-3">
            Thương Hiệu Nổi Bật
          </h3>
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span>
              vascara / dior / esteelauder / th truemilk / barbie / owen /
              ensure / durex / bioderma / elly / milo / skechers / aldo /
              triumph / nutifood / kindle / nerman / wacom / anessa / yoosee /
              olay / similac / comfort / bitas / shiseido / langfarm / hukan /
              vichy / fila / tsubaki
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
