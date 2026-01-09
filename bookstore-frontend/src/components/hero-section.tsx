import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-accent py-20 sm:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif tracking-tight text-accent-foreground text-balance leading-tight">
            Khám phá thế giới tri thức qua từng trang sách
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-accent-foreground/80 max-w-2xl mx-auto text-pretty leading-relaxed">
            Hàng ngàn đầu sách chất lượng từ các tác giả nổi tiếng trong và
            ngoài nước, mang đến cho bạn những trải nghiệm đọc tuyệt vời nhất.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8"
            >
              Khám phá ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 border-accent-foreground/20 hover:bg-accent-foreground/5 bg-transparent"
            >
              Xem bestseller
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
