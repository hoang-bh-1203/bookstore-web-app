import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

interface SummaryToggleProps {
  content: string;
}

export default function SummaryToggle({ content }: SummaryToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-2">
      <Separator className="mb-2" />
      <Collapsible open={open} onOpenChange={setOpen}>
        {/* Header */}
        <CollapsibleTrigger className="flex items-center justify-between w-full cursor-pointer">
          <div className="flex items-center gap-1.5">
            <img
              src="/src/assets/ai.svg"
              alt="ai"
              style={{ width: 20, height: 20 }}
            />
            <span className="">Tóm tắt nội dung sách</span>
          </div>
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2 py-2 text-sm leading-relaxed">
          {content}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
