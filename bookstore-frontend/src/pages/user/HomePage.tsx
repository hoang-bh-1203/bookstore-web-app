import Sidebar from '@/components/sidebar';
import FeaturedCollections from '@/components/feature-collection';
import CategorySection from '@/components/category-section';
import ProductGrid from '@/components/common/product-grid';
import TopBestSellerBook from '@/layouts/user/homePage/TopBestSellerBook';
import RelatedSearches from '@/layouts/user/homePage/RelatedSearches.tsx';
import { useRef } from 'react';
import CustomBreadcrumb from '@/components/common/breadcrumb';

const breadcrumbItems = [{ title: 'Trang chủ' }, { title: 'Nhà sách tiki' }];

const HomePage = () => {
  const productGridRef = useRef<{
    handleCategorySelect: (categoryId: number | null) => void;
  }>(null);

  const handleCategorySelect = (categoryId: number | null) => {
    productGridRef.current?.handleCategorySelect(categoryId);
  };

  return (
    <div className="flex flex-col min-h-screen mb-8">
      <CustomBreadcrumb items={breadcrumbItems} />
      <main className="flex-1 py-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Sidebar />
          </aside>
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border lg:block hidden">
              <h1 className="text-2xl font-semibold text-foreground">
                Nhà Sách Tiki
              </h1>
            </div>
            <FeaturedCollections />
            <CategorySection onCategorySelect={handleCategorySelect} />
            <ProductGrid ref={productGridRef} />
          </div>
        </div>
      </main>

      <section className="mt-8 space-y-6">
        <RelatedSearches />
        <TopBestSellerBook />
      </section>
    </div>
  );
};

export default HomePage;
