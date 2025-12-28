import { Navigation, Pagination, Zoom, Keyboard } from 'swiper/modules'

export const SWIPER_MODULES = [Navigation, Pagination, Zoom, Keyboard]

export const MAIN_SWIPER_CONFIG = {
  slidesPerView: 1,
  spaceBetween: 10,
  initialSlide: 0,
  zoom: {
    maxRatio: 2,
    minRatio: 1,
  },
  keyboard: {
    enabled: true,
  },
}

export const LIGHTBOX_SWIPER_CONFIG = {
  slidesPerView: 1,
  spaceBetween: 10,
  initialSlide: 0,
  zoom: {
    maxRatio: 3,
    minRatio: 1,
  },
  keyboard: {
    enabled: true,
  },
}

export const BUTTON_BASE_CLASSES = 'w-10 h-10 rounded-full shadow-lg backdrop-blur-sm border transition-all focus:outline-none flex items-center justify-center z-1'

export const BUTTON_STYLES = {
  active: 'bg-white/90 hover:bg-white border-gray-200 cursor-pointer',
  disabled: 'bg-gray-200/70 border-gray-300 cursor-not-allowed',
}

export const ICON_STYLES = {
  active: 'text-gray-700',
  disabled: 'text-gray-600',
}

