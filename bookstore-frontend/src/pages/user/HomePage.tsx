import { CategoryIcons } from '@/components/category-icons';
import { FeaturedBooks } from '@/components/featured-books';
import { FlashSaleSection } from '@/components/flash-sale-section';
import { HeroCarousel } from '@/components/hero-carousel';
import { RecommendedProductsSection } from '@/components/recommended-products-section';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroCarousel />
        {/* <PromoTilesSection /> */}
        <CategoryIcons />
        <FeaturedBooks />
        <FlashSaleSection />
        <RecommendedProductsSection />
        {/* <SeasonalSection /> */}
        {/* <ProductGridSection title="Sự Phương Wala Sạch" category="lifestyle" />
        <ProductGridSection title="Sách Hay Tháng Này" category="featured" /> */}
      </main>
    </div>
  );
}
