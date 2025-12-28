import { useEffect } from 'react'
import type { Swiper as SwiperType } from 'swiper'

interface UseKeyboardNavigationProps {
  isActive: boolean
  onClose: () => void
  swiperRef: React.MutableRefObject<SwiperType | null>
}

export const useKeyboardNavigation = ({
  isActive,
  onClose,
  swiperRef,
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          swiperRef.current?.slidePrev()
          break
        case 'ArrowRight':
          swiperRef.current?.slideNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, onClose, swiperRef])
}