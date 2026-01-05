import { useState } from 'react';

interface ProductImageGalleryProps {
  mainImage: string;
  title: string;
  discount?: number;
}

export function ProductImageGallery({
  mainImage,
  title,
  discount,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock thumbnail images
  const thumbnails = [mainImage, mainImage, mainImage, mainImage];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden border border-border">
        <img
          src={
            selectedImage < thumbnails.length
              ? thumbnails[selectedImage]
              : '/placeholder.svg'
          }
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {discount && discount > 0 && (
          <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1.5 rounded text-sm font-semibold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {thumbnails.map((thumb, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`relative w-16 h-20 rounded border-2 overflow-hidden transition-colors ${
              selectedImage === idx ? 'border-primary' : 'border-border'
            }`}
          >
            <img
              src={thumb || '/placeholder.svg'}
              alt={`${title} ${idx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
        {thumbnails.length > 4 && (
          <div className="relative w-16 h-20 rounded bg-muted border border-border flex items-center justify-center cursor-pointer hover:bg-muted/80">
            <span className="text-sm font-semibold text-foreground">
              +{thumbnails.length - 4}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
