import Image from "next/image"
import { ThumbnailGalleryProps } from '../types'

export const ThumbnailGallery = ({ 
  images, 
  currentSlide, 
  onThumbnailClick 
}: ThumbnailGalleryProps) => {
  if (images.length <= 1) return null

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pt-2">
      {images.map((image, index) => (
        <button
          key={`thumb-${image.id}`}
          onClick={() => onThumbnailClick(index)}
          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
            index === currentSlide 
              ? 'border-primary' 
              : 'border-base-300 hover:border-base-400'
          }`}
        >
          {image.url && (
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          )}
        </button>
      ))}
    </div>
  )
}