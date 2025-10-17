"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { BANNER_SWIPER_MODULES, BANNER_SWIPER_CONFIG } from "./constants"
import { BannerSliderProps } from "./types"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useLayoutBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"
import { useEffect } from "react"

const BannerSlider = ({ banner }: BannerSliderProps) => {
  const { clearBreadcrumbs } = useLayoutBreadcrumbs()

  useEffect(() => {
    clearBreadcrumbs()
  }, [clearBreadcrumbs])

  if (!banner?.images || banner.images.length === 0) {
    return null
  }

  return (
    <>
      <div className="w-full mt-8 mb-8">
        <Swiper
          modules={BANNER_SWIPER_MODULES}
          {...BANNER_SWIPER_CONFIG}
          pagination={{
            enabled: banner.images.length > 1,
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={banner.images.length > 1}
          className="rounded-lg shadow-lg overflow-hidden banner-slider"
        >
          {banner.images.map((imageUrl, index) => (
            <SwiperSlide key={`${banner.id}-${index}`}>
              <div className="relative w-full aspect-[21/9] sm:aspect-[16/9] md:aspect-[21/9] bg-base-200">
                <Image
                  src={imageUrl}
                  alt={`Banner image ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .banner-slider .swiper-button-next,
        .banner-slider .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }

        .banner-slider .swiper-button-next:hover,
        .banner-slider .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .banner-slider .swiper-button-next:after,
        .banner-slider .swiper-button-prev:after {
          font-size: 14px;
        }
      `}</style>
    </>
  )
}

export default BannerSlider
