import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import type { Book } from '@/constants/interfaces';
import { useBook } from '@/hooks/useBook.ts';
import CustomBreadcrumb from '@/components/common/breadcrumb';
import BookImageGallery from '@/layouts/user/bookDetailPage/BookImageGallery';
import SummaryToggle from '@/layouts/user/bookDetailPage/SummaryToggle';
import BookInfo from '@/layouts/user/bookDetailPage/BookInfo';
import BookMetaData from '@/layouts/user/bookDetailPage/BookMetadata';
import BookDescription from '@/layouts/user/bookDetailPage/BookDescription';
import SimilarProducts from '@/layouts/user/bookDetailPage/SimilarProducts';
import TopDeals from '@/layouts/user/bookDetailPage/TopDeals';
import SaveShopping from '@/layouts/user/bookDetailPage/SaveShopping';
import PurchaseActions from '@/layouts/user/bookDetailPage/PurchaseAction';
import { Card, CardContent } from '@/components/ui/card';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { getBookById } = useBook();
  const [book, setBook] = useState<Book>();

  useEffect(() => {
    if (!id) return;
    const bookId = Number(id);
    if (isNaN(bookId)) return;
    (async () => {
      try {
        const data = await getBookById(bookId);
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    })();
  }, [id, getBookById]);

  const breadcrumbItems = useMemo(
    () => [
      { title: 'Trang chủ', href: '/' },
      { title: 'Nhà sách BS', href: '/' },
      { title: book?.name || 'Chi tiết sách', href: `/books/${book?.id}` },
    ],
    [book],
  );

  return (
    <div className="flex-grow container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
      <CustomBreadcrumb items={breadcrumbItems} />
      <main className="flex-1 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Images */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Card className="sticky top-4">
              <CardContent className="p-4 flex flex-col gap-4">
                <BookImageGallery images={book?.images || []} />
                <SummaryToggle content={book?.shortDescription || ''} />
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Info & Details */}
          <div className="lg:col-span-8 xl:col-span-6 flex flex-col gap-4">
            <Card>
              <CardContent className="p-4">
                <BookInfo book={book || undefined} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <BookMetaData book={book || undefined} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <BookDescription book={book || undefined} />
              </CardContent>
            </Card>
            <div className="space-y-4">
              {' '}
              {/* Wrap similar & deals separately if they have their own cards */}
              <SimilarProducts book={book || undefined} />
              <TopDeals />
            </div>
          </div>

          {/* Right Column: Purchase Actions (Sticky on Desktop, Fixed bottom on Mobile) */}
          <div className="lg:col-span-12 xl:col-span-3">
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background p-2 border-t lg:static lg:border-none lg:p-0 lg:z-auto">
              <div className="lg:sticky lg:top-4">
                <PurchaseActions book={book || undefined} />
                <div className="mt-4 hidden xl:block">
                  <Card>
                    <CardContent className="p-0">
                      <SaveShopping />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            {/* Mobile only SaveShopping if needed elsewhere or keep hidden */}
            <div className="xl:hidden mt-4">
              <Card>
                <CardContent className="p-0">
                  <SaveShopping />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
