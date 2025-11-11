import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CounterProps {
  min?: number;
  max?: number;
  initial?: number;
  onChange?: (value: number) => void;
}

export default function Counter({
  min = 1,
  max = 100,
  initial = 1,
  onChange,
}: CounterProps) {
  const [value, setValue] = useState(initial);

  // Logic remains 100% the same
  const handleDecrease = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Minus button */}
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8"
        onClick={handleDecrease}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Number */}
      <div className="w-10 h-8 flex items-center justify-center border border-input rounded-md text-sm">
        {value}
      </div>

      {/* Plus button */}
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8"
        onClick={handleIncrease}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
