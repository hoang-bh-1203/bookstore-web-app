import { Gift, Zap } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  discount: string;
  icon: 'gift' | 'zap';
}

interface RelatedOffersSectionProps {
  offers?: Offer[];
}

export function RelatedOffersSection({
  offers = [
    {
      id: '1',
      title: 'Mã giảm 10% - tối đa 50k',
      discount: '10%',
      icon: 'gift',
    },
    {
      id: '2',
      title: 'Mã giảm 20% - tối đa 100k',
      discount: '20%',
      icon: 'zap',
    },
    {
      id: '3',
      title: 'Zaloapy: giảm 15% - tối đa 30k',
      discount: '15%',
      icon: 'gift',
    },
    { id: '4', title: 'Sacombank: giảm 5%', discount: '5%', icon: 'zap' },
  ],
}: RelatedOffersSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Ưu đãi liên quan</h3>
      <div className="grid grid-cols-2 gap-2">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex items-center gap-2 p-2 bg-muted rounded border border-border hover:border-primary cursor-pointer transition-colors"
          >
            {offer.icon === 'gift' ? (
              <Gift className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <Zap className="h-4 w-4 text-primary flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground truncate">{offer.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
