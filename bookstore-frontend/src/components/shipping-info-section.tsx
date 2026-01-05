import { MapPin, Truck, Clock } from 'lucide-react';

interface ShippingInfoSectionProps {
  location?: string;
  deliveryTime?: string;
  shippingMethod?: string;
}

export function ShippingInfoSection({
  location = 'Phường Bến Nghé, Quận 1, TP Hồ Chí Minh',
  deliveryTime = 'Dự kiến thứ 5 - 21/10',
  shippingMethod = 'Được giao bởi TikiNOW Smart Logistics',
}: ShippingInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Thông tin vận chuyển</h3>

      <div className="space-y-3">
        <div className="flex gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Giao hàng đến</p>
            <p className="text-sm font-medium text-foreground">{location}</p>
            <a href="#" className="text-sm text-primary hover:underline">
              Thay đổi
            </a>
          </div>
        </div>

        <div className="flex gap-3">
          <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Thời gian giao hàng</p>
            <p className="text-sm font-medium text-foreground">
              {deliveryTime}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              Phương thức giao hàng
            </p>
            <p className="text-sm font-medium text-foreground">
              {shippingMethod}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Miễn phí vận chuyển
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
