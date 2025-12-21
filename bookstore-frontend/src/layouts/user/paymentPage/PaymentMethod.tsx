// layouts/user/payment_page/PaymentMethod.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import OfferCard from './OfferCard.tsx';
import { Tag, Banknote, CreditCard } from 'lucide-react';

const offers = [
  {
    title: 'Freeship',
    subtitle: 'Thẻ Shinhan Platinum',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Freeship',
    subtitle: 'Thẻ Shinhan Classic',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 30k',
    subtitle: 'Đơn từ 200k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 50k',
    subtitle: 'Đơn từ 300k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 50k',
    subtitle: 'Đơn từ 300k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 70k',
    subtitle: 'Đơn từ 500k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 100k',
    subtitle: 'Đơn từ 700k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 150k',
    subtitle: 'Đơn từ 1 triệu',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 30k',
    subtitle: 'Đơn từ 200k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 50k',
    subtitle: 'Đơn từ 300k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Giảm 70k',
    subtitle: 'Đơn từ 500k',
    condition: '',
    brandLogo: 'src/assets/shinhan-bank.svg',
  },
  {
    title: 'Freeship',
    subtitle: 'BS Card',
    condition: '',
    brandLogo: 'src/assets/tiki-card.svg',
  },
];

export default function PaymentMethod() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Chọn hình thức thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Radio Group cho phương thức thanh toán */}
        <RadioGroup
          defaultValue="cash"
          className="flex flex-col gap-3 w-full md:w-3/4"
        >
          <div className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:bg-accent transition-colors">
            <RadioGroupItem value="cash" id="cash" />
            <Label
              htmlFor="cash"
              className="flex items-center gap-3 flex-1 cursor-pointer font-normal"
            >
              <Banknote className="h-6 w-6 text-primary" />
              <span>Thanh toán tiền mặt khi nhận hàng</span>
            </Label>
          </div>
          <div className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:bg-accent transition-colors">
            <RadioGroupItem value="viettel" id="viettel" />
            <Label
              htmlFor="viettel"
              className="flex items-center gap-3 flex-1 cursor-pointer font-normal"
            >
              <CreditCard className="h-6 w-6 text-primary" />{' '}
              {/* Thay icon tạm */}
              <span>Viettel Money</span>
            </Label>
          </div>
        </RadioGroup>

        {/* Phần ưu đãi thẻ */}
        <div className="bg-muted/50 p-4 rounded-lg w-full md:w-4/5">
          <div className="flex items-center mb-3 text-primary font-medium">
            <Tag className="h-4 w-4 mr-2" />
            Ưu đãi thanh toán thẻ
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {offers.slice(0, 6).map(
              (
                offer,
                index, // Giới hạn hiển thị demo
              ) => (
                <OfferCard key={index} {...offer} />
              ),
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
