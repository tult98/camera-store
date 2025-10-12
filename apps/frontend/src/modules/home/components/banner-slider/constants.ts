import { Autoplay, Navigation, Pagination } from 'swiper/modules'

export const BANNER_SWIPER_MODULES = [Autoplay, Pagination, Navigation]

export const BANNER_SWIPER_CONFIG = {
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  speed: 800,
}
