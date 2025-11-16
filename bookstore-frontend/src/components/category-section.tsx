import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CategoryWithThumbnail } from '@/constants/interfaces';
import { useEffect, useState } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

interface CategorySectionProps {
  onCategorySelect: (categoryId: number | null) => void;
}

export default function CategorySection({
  onCategorySelect,
}: CategorySectionProps) {
  const { getCategoryWithThumbnail } = useCategory();
  const [categories, setCategories] = useState<CategoryWithThumbnail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryWithThumbnail();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: CategoryWithThumbnail) => {
    if (selectedCategory === category.id) {
      setSelectedCategory(null);
      onCategorySelect(null);
    } else {
      setSelectedCategory(category.id);
      onCategorySelect(category.id);
    }
  };

  return (
    <Card className="mb-6 hidden lg:block border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          Khám phá theo danh mục
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 bg-white rounded-lg p-4 shadow-sm border">
        <div className="grid md:grid-cols-6 gap-4 justify-items-center">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="text-center cursor-pointer group flex flex-col items-center"
                onClick={() => handleCategoryClick(category)}
              >
                <Avatar
                  className={cn(
                    'h-24 w-24 mb-3 transition-all duration-200 group-hover:opacity-80',
                    selectedCategory === category.id &&
                      'ring-4 ring-primary/40',
                  )}
                >
                  <AvatarImage
                    src={category.thumbnailUrl}
                    alt={category.name}
                    className="object-contain p-2"
                  />
                  <AvatarFallback className="bg-muted">
                    <LayoutGrid className="h-10 w-10 text-muted-foreground/50" />
                  </AvatarFallback>
                </Avatar>
                <p
                  className={cn(
                    'text-sm font-medium text-center transition-colors',
                    selectedCategory === category.id
                      ? 'text-primary'
                      : 'text-foreground group-hover:text-primary',
                  )}
                >
                  {category.name}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-6 text-center text-muted-foreground py-8">
              Không có danh mục nào
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
