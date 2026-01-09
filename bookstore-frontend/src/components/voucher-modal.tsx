import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, Check } from 'lucide-react';

interface VoucherCode {
  discount: number;
  description: string;
  title: string;
  minOrder: number;
  maxDiscount: number;
  type: 'product' | 'shipping';
}

interface VoucherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtotal: number;
  onApplyVoucher: (code: string) => void;
  appliedProductCode: string | null;
  appliedShippingCode: string | null;
}

const VOUCHER_CODES: Record<string, VoucherCode> = {
  // Product discount codes
  WELCOME10: {
    discount: 0.1,
    description: 'Giảm 10% cho đơn hàng đầu tiên',
    title: 'Giảm 10%',
    minOrder: 0,
    maxDiscount: 50000,
    type: 'product',
  },
  BOOK20: {
    discount: 0.2,
    description: 'Giảm 20% cho đơn hàng từ 200k',
    title: 'Giảm 20%',
    minOrder: 200000,
    maxDiscount: 100000,
    type: 'product',
  },
  SAVE30K: {
    discount: 30000,
    description: 'Giảm 30k cho đơn từ 150k',
    title: 'Giảm 30k',
    minOrder: 150000,
    maxDiscount: 30000,
    type: 'product',
  },
  SAVE50K: {
    discount: 50000,
    description: 'Giảm 50k cho đơn từ 300k',
    title: 'Giảm 50k',
    minOrder: 300000,
    maxDiscount: 50000,
    type: 'product',
  },
  SAVE70K: {
    discount: 70000,
    description: 'Giảm 70k cho đơn từ 500k',
    title: 'Giảm 70k',
    minOrder: 500000,
    maxDiscount: 70000,
    type: 'product',
  },
  // Shipping discount codes
  FREESHIP: {
    discount: 30000,
    description: 'Miễn phí vận chuyển',
    title: 'Freeship',
    minOrder: 0,
    maxDiscount: 30000,
    type: 'shipping',
  },
  SHIP15K: {
    discount: 15000,
    description: 'Giảm 15k phí vận chuyển',
    title: 'Giảm ship 15k',
    minOrder: 100000,
    maxDiscount: 15000,
    type: 'shipping',
  },
  SHIP20K: {
    discount: 20000,
    description: 'Giảm 20k phí vận chuyển cho đơn từ 200k',
    title: 'Giảm ship 20k',
    minOrder: 200000,
    maxDiscount: 20000,
    type: 'shipping',
  },
};

export function VoucherModal({
  open,
  onOpenChange,
  subtotal,
  onApplyVoucher,
  appliedProductCode,
  appliedShippingCode,
}: VoucherModalProps) {
  const productVouchers = Object.entries(VOUCHER_CODES).filter(
    ([_, v]) => v.type === 'product',
  );
  const shippingVouchers = Object.entries(VOUCHER_CODES).filter(
    ([_, v]) => v.type === 'shipping',
  );

  const renderVoucherCard = (
    code: string,
    details: VoucherCode,
    appliedCode: string | null,
  ) => {
    const isEligible = subtotal >= details.minOrder;
    const isApplied = appliedCode === code;

    return (
      <button
        key={code}
        onClick={() => {
          if (isEligible) {
            onApplyVoucher(isApplied ? '' : code);
          }
        }}
        disabled={!isEligible}
        className={`relative p-4 rounded-lg border-2 text-left transition-all ${
          isApplied
            ? 'border-primary bg-primary/10'
            : isEligible
              ? 'border-border hover:border-primary/50 hover:bg-muted/50'
              : 'border-border bg-muted/30 opacity-60 cursor-not-allowed'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded p-1.5">
              <Tag className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-primary">
              {details.title}
            </span>
          </div>
          {isApplied && (
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {details.description}
        </p>
        <div className="flex items-center justify-between">
          {details.minOrder > 0 && (
            <p className="text-xs text-muted-foreground">
              Đơn từ {details.minOrder.toLocaleString('vi-VN')}đ
            </p>
          )}
          <Badge variant="outline" className="text-xs ml-auto">
            {code}
          </Badge>
        </div>
        {!isEligible && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">
              Chưa đủ điều kiện
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn mã giảm giá</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="product" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product">Giảm giá sản phẩm</TabsTrigger>
            <TabsTrigger value="shipping">Giảm phí vận chuyển</TabsTrigger>
          </TabsList>

          <TabsContent value="product" className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Chọn một mã giảm giá cho sản phẩm
            </p>
            {productVouchers.map(([code, details]) =>
              renderVoucherCard(code, details, appliedProductCode),
            )}
          </TabsContent>

          <TabsContent value="shipping" className="space-y-3 mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Chọn một mã giảm phí vận chuyển
            </p>
            {shippingVouchers.map(([code, details]) =>
              renderVoucherCard(code, details, appliedShippingCode),
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
