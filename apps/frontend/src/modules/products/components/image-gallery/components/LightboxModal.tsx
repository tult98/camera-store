import Image from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react'
import { XMarkIcon } from "@heroicons/react/24/outline"
import { LightboxModalProps } from '../types'
import { SWIPER_MODULES, LIGHTBOX_SWIPER_CONFIG } from '../constants'
import { useKeyboardNavigation, useBodyScrollLock, useSwiperRefs } from '../hooks'

export const LightboxModal = ({
  isOpen,
  images,
  currentSlide,
  onClose,
}: LightboxModalProps) => {
  const { lightboxSwiperRef } = useSwiperRefs()
  
  useKeyboardNavigation({
    isActive: isOpen,
    onClose,
    swiperRef: lightboxSwiperRef,
  })
  
  useBodyScrollLock(isOpen)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-7xl max-h-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-circle btn-ghost text-white hover:bg-white/10 z-20"
          aria-label="Close lightbox"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Lightbox Swiper */}
        <Swiper
          modules={SWIPER_MODULES}
          {...LIGHTBOX_SWIPER_CONFIG}
          navigation={{
            enabled: images.length > 1,
          }}
          pagination={{
            enabled: images.length > 1,
            clickable: true,
          }}
          initialSlide={currentSlide}
          onSwiper={(swiper) => {
            lightboxSwiperRef.current = swiper
          }}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`lightbox-${image.id}`} className="flex items-center justify-center">
              <div className="swiper-zoom-container">
                {image.url && (
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    width={1200}
                    height={1200}
                    className="max-w-full max-h-full object-contain"
                    sizes="100vw"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}