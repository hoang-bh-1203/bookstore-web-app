import type { ImageBook } from '@/constants/interfaces.ts';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Replaced antd icons
import { Button } from '@/components/ui/button'; // Use Shadcn Button
import { cn } from '@/lib/utils';

interface BookImageGalleryProps {
  images: ImageBook[];
}

export default function BookImageGallery({ images }: BookImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState('');
  const thumbnailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0].baseUrl || '');
    }
  }, [images]);

  // Logic remains 100% the same
  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = 80 * 3;
      thumbnailRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main Image */}
      <div
        className={cn(
          'w-[250px] h-[250px] flex items-center justify-center',
          'bg-white rounded-lg overflow-hidden border',
        )}
      >
        <img
          src={selectedImage}
          alt="Book"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      <div className="relative flex items-center mt-3 w-full max-w-[250px]">
        {/* Left Button */}
        {images.length > 4 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 z-10 rounded-full h-8 w-8"
            onClick={() => scrollThumbnails('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Thumbnail List */}
        <div
          ref={thumbnailRef}
          className="flex-1 flex gap-2 overflow-x-hidden scroll-smooth"
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className={cn(
                'w-[54px] h-[54px] flex items-center justify-center',
                'bg-white rounded-lg overflow-hidden',
                'border-2 cursor-pointer flex-shrink-0',
                selectedImage === img.baseUrl
                  ? 'border-primary' // Replaced border-blue-500
                  : 'border-border',
              )}
              onClick={() => setSelectedImage(img.baseUrl || '')}
            >
              <img
                src={img.baseUrl || ''}
                alt="Thumbnail"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Right Button */}
        {images.length > 4 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 z-10 rounded-full h-8 w-8"
            onClick={() => scrollThumbnails('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
