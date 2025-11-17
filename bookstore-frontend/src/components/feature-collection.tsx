import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FeaturedCollectionData } from '@/constants/interfaces';
import { useBook } from '@/hooks/useBook.ts';
import { useApiHealth } from '@/hooks/useApiHealth.ts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FeaturedCollections: React.FC = () => {
  const navigate = useNavigate();
  const { getBookFeaturedCollections } = useBook();
  const { isHealthy } = useApiHealth();
  const [allCards, setAllCards] = useState<FeaturedCollectionData[]>([]);

  useEffect(() => {
    // Only fetch if API is healthy
    if (!isHealthy) {
      return;
    }

    const fetchCollections = async () => {
      try {
        const response = await getBookFeaturedCollections();
        setAllCards(response || []);
      } catch (err) {
        console.error('Error fetching featured collections:', err);
        setAllCards([]);
      }
    };
    fetchCollections();
  }, [isHealthy, getBookFeaturedCollections]);

  const handleProductClick = (productId: number) => {
    navigate(`/books/${productId}`);
  };

  // Show nothing if API is not healthy (no error message for featured collections)
  if (!isHealthy || allCards.length === 0) {
    return null;
  }

  // Group cards into pairs for the carousel slide (2 items per slide as per original design)
  const groupedCards = [];
  for (let i = 0; i < allCards.length; i += 2) {
    groupedCards.push(allCards.slice(i, i + 2));
  }

  return (
    <div className="relative w-full hidden lg:block bg-[#F5F5FA] py-4">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {groupedCards.map((group, index) => (
            <CarouselItem key={index} className="md:basis-full lg:basis-full">
              <div className="flex gap-4">
                {group.map((cardData, idx) => (
                  <Card
                    key={`${index}-${idx}`}
                    className="flex-1 overflow-hidden border-none shadow-sm h-[186px] flex"
                  >
                    <div className="w-[186px] h-full flex items-center justify-center bg-muted/20 flex-shrink-0">
                      <img
                        src={cardData.logo}
                        alt={cardData.title}
                        className="object-contain max-w-[80%] max-h-[80%]"
                      />
                    </div>
                    <CardContent className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          {cardData.title}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          Tài trợ bởi{' '}
                          <span className="font-medium text-foreground">
                            {cardData.sponsor}
                          </span>
                          <span className="inline-block mx-1">•</span>
                          <span className="text-foreground flex items-center gap-0.5">
                            {cardData.ratingText}{' '}
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {cardData.listProduct.slice(0, 3).map(
                          (
                            product, // Limit to 3 products to fit
                          ) => (
                            <div
                              key={product.id}
                              className="relative group cursor-pointer"
                              onClick={() => handleProductClick(product.id)}
                            >
                              <img
                                src={product.url}
                                alt={`Product ${product.id}`}
                                className="w-16 h-16 object-cover rounded-md border shadow-sm group-hover:shadow-md transition-all"
                              />
                              {product.discountPercent > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="absolute -right-2 -bottom-2 px-1 py-0 text-[10px] h-4 min-w-[1.5rem] justify-center"
                                >
                                  -{product.discountPercent}%
                                </Badge>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* If group has only 1 item, add an empty placeholder to maintain layout if needed, or flex handles it */}
                {group.length === 1 && <div className="flex-1" />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default FeaturedCollections;
