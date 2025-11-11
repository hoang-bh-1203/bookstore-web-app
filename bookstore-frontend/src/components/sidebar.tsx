// components/Sidebar.tsx

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SidebarCategory } from '@/constants/interfaces';
import { useCategory } from '@/hooks/useCategory';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const { getAllCategoriesWithSub } = useCategory();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesWithSub();
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Card className="border-none shadow-none hidden lg:block bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-base font-semibold">
          Khám phá theo danh mục
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 bg-white rounded-lg shadow-sm border">
        {categories.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Không có danh mục nào
          </div>
        ) : (
          <Accordion type="multiple" className="w-full">
            {categories.map((cat) => {
              const hasSubcategories =
                cat.subcategories &&
                Array.isArray(cat.subcategories) &&
                cat.subcategories.length > 0;

              if (hasSubcategories) {
                return (
                  <AccordionItem
                    value={String(cat.id)}
                    key={cat.id}
                    className="border-b last:border-none"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 text-sm font-medium">
                      {cat.name}
                    </AccordionTrigger>
                    <AccordionContent className="pt-0 pb-2">
                      <div className="flex flex-col">
                        {cat.subcategories!.map((subCat) => (
                          <a
                            key={subCat.id}
                            href={`/category/${subCat.id}`} // Assuming standard routing
                            className="px-4 py-2 pl-8 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors block"
                          >
                            {subCat.name}
                          </a>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              } else {
                return (
                  <div key={cat.id} className="border-b last:border-none">
                    <a
                      href={`/category/${cat.id}`}
                      className={cn(
                        'flex flex-1 items-center justify-between py-3 px-4 font-medium transition-all hover:bg-accent/50 text-sm',
                        '[&[data-state=open]>svg]:rotate-180',
                      )}
                    >
                      {cat.name}
                    </a>
                  </div>
                );
              }
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
