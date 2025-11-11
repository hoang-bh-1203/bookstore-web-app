import ListProductsSearch from '@/components/common/list-products-search';
import Sidebar from '@/components/sidebar';
import { useSearchParams } from 'react-router-dom';

const SearchByName = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';

  return (
    <div className="flex flex-col min-h-screen mb-8">
      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Sidebar />
          </aside>
          <div className="flex-1 w-full min-w-0">
            <ListProductsSearch keyword={keyword} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchByName;
