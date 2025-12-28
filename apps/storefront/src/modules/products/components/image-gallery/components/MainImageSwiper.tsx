import Image from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react'
import { MainImageSwiperProps } from '../types'
import { SWIPER_MODULES, MAIN_SWIPER_CONFIG } from '../constants'
import { NavigationButton } from './NavigationButton'
import { ZoomButton } from './ZoomButton'

export const MainImageSwiper = ({
  images,
  currentSlide,
  onSlideChange,
  onZoomClick,
  swiperRef,
}: MainImageSwiperProps) => {
  return (
    <div className="relative group mb-6">
      <Swiper
        modules={SWIPER_MODULES}
        {...MAIN_SWIPER_CONFIG}
        pagination={{
          enabled: images.length > 1,
          clickable: true,
          dynamicBullets: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
        className="aspect-square bg-base-200 rounded-lg overflow-hidden shadow-sm"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id} className="relative">
            <div className="swiper-zoom-container w-full h-full">
              {image.url && (
                <Image
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  fill
                  priority={index <= 2}
                  className="object-cover!"
                  sizes="(max-width: 576px) 100vw, (max-width: 768px) 80vw, 600px"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <NavigationButton
            direction="prev"
            isDisabled={currentSlide === 0}
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <NavigationButton
            direction="next"
            isDisabled={currentSlide === images.length - 1}
            onClick={() => swiperRef.current?.slideNext()}
          />
        </>
      )}

      {/* Zoom Button */}
      <ZoomButton onClick={onZoomClick} />
    </div>
  )
}