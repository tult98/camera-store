"use client"

import { useState } from "react"
import { ImageGalleryProps } from './types'
import { MainImageSwiper, ThumbnailGallery, LightboxModal } from './components'
import { useSwiperRefs } from './hooks'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/zoom'

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { mainSwiperRef } = useSwiperRefs()

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center aspect-square bg-base-200 rounded-lg">
        <span className="text-base-content/60">No images available</span>
      </div>
    )
  }

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  const handleZoomClick = () => {
    setIsLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setIsLightboxOpen(false)
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index)
    mainSwiperRef.current?.slideTo(index)
  }

  return (
    <>
      <div className="w-full mx-auto">
        <MainImageSwiper
          images={images}
          currentSlide={currentSlide}
          onSlideChange={handleSlideChange}
          onZoomClick={handleZoomClick}
          swiperRef={mainSwiperRef}
        />
        
        <ThumbnailGallery
          images={images}
          currentSlide={currentSlide}
          onThumbnailClick={handleThumbnailClick}
        />
      </div>

      <LightboxModal
        isOpen={isLightboxOpen}
        images={images}
        currentSlide={currentSlide}
        onClose={handleLightboxClose}
      />

      <style jsx global>{`
        .swiper-pagination {
          bottom: 16px !important;
        }
        
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        
        .swiper-pagination-bullet-active {
          background: white;
        }
        
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 16px;
        }
      `}</style>
    </>
  )
}

export default ImageGallery
