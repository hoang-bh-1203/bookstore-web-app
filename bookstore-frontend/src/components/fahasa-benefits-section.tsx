import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface BenefitItem {
  id: string;
  title: string;
  description: string;
}

interface FahasaBenefitsSectionProps {
  benefits?: BenefitItem[];
}

export function FahasaBenefitsSection({
  benefits = [
    {
      id: '1',
      title: 'Thời gian giao hàng',
      description: 'Giao nhận và ưu tiên',
    },
    {
      id: '2',
      title: 'Chính sách đổi trả',
      description: 'Đổi ưu tiên với đơn hàng toàn quốc',
    },
    {
      id: '3',
      title: 'Chính sách khách sạn',
      description: 'Ưu đãi mua sắm lượng lớn',
    },
  ],
}: FahasaBenefitsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-2 border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-3">
        Chính sách ưu đãi của Fahasa
      </h3>
      {benefits.map((benefit) => (
        <div
          key={benefit.id}
          className="border-b border-border last:border-b-0"
        >
          <button
            onClick={() =>
              setExpandedId(expandedId === benefit.id ? null : benefit.id)
            }
            className="w-full flex items-center justify-between py-3 text-left hover:bg-muted/50 px-2 rounded transition-colors"
          >
            <div>
              <p className="font-medium text-foreground text-sm">
                {benefit.title}
              </p>
              {expandedId !== benefit.id && (
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              )}
            </div>
            <ChevronRight
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                expandedId === benefit.id ? 'rotate-90' : ''
              }`}
            />
          </button>
          {expandedId === benefit.id && (
            <div className="px-2 pb-3 text-sm text-muted-foreground">
              <p>{benefit.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
