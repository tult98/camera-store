import { HttpTypes } from "@medusajs/types"
import type { Swiper as SwiperType } from 'swiper'

export interface ImageGalleryProps {
  images: HttpTypes.StoreProductImage[]
}

export interface MainImageSwiperProps {
  images: HttpTypes.StoreProductImage[]
  currentSlide: number
  onSlideChange: (index: number) => void
  onZoomClick: () => void
  swiperRef: React.MutableRefObject<SwiperType | null>
}

export interface NavigationButtonProps {
  direction: 'prev' | 'next'
  isDisabled: boolean
  onClick?: () => void
  className?: string
}

export interface ZoomButtonProps {
  onClick: () => void
}

export interface ThumbnailGalleryProps {
  images: HttpTypes.StoreProductImage[]
  currentSlide: number
  onThumbnailClick: (index: number) => void
}

export interface LightboxModalProps {
  isOpen: boolean
  images: HttpTypes.StoreProductImage[]
  currentSlide: number
  onClose: () => void
}