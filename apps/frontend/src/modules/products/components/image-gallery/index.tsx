"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-square bg-base-200 rounded-lg">
        <span className="text-base-content/60">No images available</span>
      </div>
    )
  }

  const currentImage = images[currentImageIndex]

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const openLightbox = () => {
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setIsZoomed(false)
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="w-full mx-auto">
        {/* Main Image Display */}
        <div className="relative group">
          <div className="aspect-square bg-base-200 rounded-lg overflow-hidden relative">
            {currentImage?.url && (
              <Image
                src={currentImage.url}
                alt={`Product image ${currentImageIndex + 1}`}
                fill
                priority={currentImageIndex <= 2}
                className="object-cover transition-transform duration-200 hover:scale-105"
                sizes="(max-width: 576px) 100vw, (max-width: 768px) 80vw, 600px"
              />
            )}
            
            {/* Zoom Button */}
            <button
              onClick={openLightbox}
              className="absolute top-4 right-4 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="View full size"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>

            {/* Navigation Arrows - Only show if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-base-100/80 hover:bg-base-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-base-100/80 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails - Only show if multiple images */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex 
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
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 btn btn-circle btn-ghost text-white hover:bg-white/10 z-10"
              aria-label="Close lightbox"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Navigation in Lightbox */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white hover:bg-white/10 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white hover:bg-white/10 z-10"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Lightbox Image */}
            <div 
              className={`relative max-w-full max-h-full transition-transform duration-200 cursor-zoom-${isZoomed ? 'out' : 'in'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {currentImage?.url && (
                <Image
                  src={currentImage.url}
                  alt={`Product image ${currentImageIndex + 1}`}
                  width={1200}
                  height={1200}
                  className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  sizes="100vw"
                />
              )}
            </div>

            {/* Lightbox Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
