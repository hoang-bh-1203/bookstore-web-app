interface SpecItem {
  label: string;
  value: string;
}

interface ProductSpecsSectionProps {
  specs: SpecItem[];
}

export function ProductSpecsSection({ specs }: ProductSpecsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Thông tin chi tiết</h3>
      <div className="space-y-3 text-sm">
        {specs.map((spec, idx) => (
          <div
            key={idx}
            className="flex justify-between py-2 border-b border-border last:border-b-0"
          >
            <span className="text-muted-foreground">{spec.label}</span>
            <span className="text-foreground font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
