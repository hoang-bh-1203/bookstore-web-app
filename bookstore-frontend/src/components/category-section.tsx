import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  Briefcase,
  Heart,
  Lightbulb,
  Rocket,
  Users,
} from 'lucide-react';

const categories = [
  {
    id: 1,
    name: 'Văn học',
    icon: BookOpen,
    count: '1,234 cuốn',
    color: 'text-secondary',
  },
  {
    id: 2,
    name: 'Kinh doanh',
    icon: Briefcase,
    count: '856 cuốn',
    color: 'text-secondary',
  },
  {
    id: 3,
    name: 'Tâm lý',
    icon: Heart,
    count: '645 cuốn',
    color: 'text-secondary',
  },
  {
    id: 4,
    name: 'Kỹ năng sống',
    icon: Lightbulb,
    count: '923 cuốn',
    color: 'text-secondary',
  },
  {
    id: 5,
    name: 'Khởi nghiệp',
    icon: Rocket,
    count: '412 cuốn',
    color: 'text-secondary',
  },
  {
    id: 6,
    name: 'Phát triển bản thân',
    icon: Users,
    count: '789 cuốn',
    color: 'text-secondary',
  },
];

export function CategorySection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-foreground text-balance">
            Danh mục sách
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá hàng ngàn đầu sách theo từng chủ đề yêu thích
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="group cursor-pointer border-border hover:border-secondary/50 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent group-hover:bg-secondary/10 transition-colors">
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm sm:text-base">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {category.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
