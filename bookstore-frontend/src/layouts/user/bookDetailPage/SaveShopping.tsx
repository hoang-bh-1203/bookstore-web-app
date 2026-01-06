// layouts/user/book_detail_page/SaveShopping.tsx

import {
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CircleDollarSign,
  PackageX,
} from 'lucide-react'; // Replaced antd icons
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'; // Use Shadcn Collapsible
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator'; // Replaced <hr>
import { useState } from 'react';

export default function SaveShopping() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between cursor-pointer w-full">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-md px-3">An tâm mua sắm</p>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 pt-2">
        <div className="flex gap-2 p-2 items-center">
          <ShieldCheck className="h-5 w-5 text-gray-600" />
          <div className="flex-1 text-sm">Được đồng kiểm khi nhận hàng</div>
        </div>
        <Separator />
        <div className="flex gap-2 p-2 items-center">
          <CircleDollarSign className="h-5 w-5 text-gray-600" />
          <div className="flex-1 text-sm">
            Được hoàn tiền 200% nếu là hàng giả
          </div>
        </div>
        <Separator />
        <div className="flex gap-2 p-2 items-center">
          <PackageX className="h-5 w-5 text-gray-600" />
          <div className="flex-1 text-sm">
            Đổi trả miễn phí trong 30. Được đổi ý.
            <br />
            <Link to={''} className="underline text-primary">
              Chi tiết
            </Link>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
