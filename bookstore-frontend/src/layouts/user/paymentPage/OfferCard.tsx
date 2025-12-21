import { Info } from 'lucide-react';

type OfferCardProps = {
  title: string;
  subtitle?: string;
  brandLogo: string;
};

export default function OfferCard({
  title,
  subtitle,
  brandLogo,
}: OfferCardProps) {
  return (
    <div className="bg-background border rounded-md shadow-sm p-3 flex flex-col justify-between min-h-[90px] hover:border-primary duration-200 cursor-pointer transition-colors">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <div className="text-[17px] font-semibold text-primary">
              {title}
            </div>
            <div className="flex-1"></div>
            <div>
              <img src={brandLogo} alt="logo" className="h-5 ml-2" />
            </div>
          </div>

          {subtitle && (
            <div className="flex items-center gap-1 mt-1">
              <div className="text-[11px] text-muted-foreground">
                {subtitle}
              </div>
              <div className="flex-1"></div>
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="text-[11px] text-orange-500 italic">
            Không giới hạn
          </div>
        </div>
      </div>
    </div>
  );
}
