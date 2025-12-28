import { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'

export const useSwiperRefs = () => {
  const mainSwiperRef = useRef<SwiperType | null>(null)
  const lightboxSwiperRef = useRef<SwiperType | null>(null)

  return {
    mainSwiperRef,
    lightboxSwiperRef,
  }
}