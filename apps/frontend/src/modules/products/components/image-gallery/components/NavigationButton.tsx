import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { NavigationButtonProps } from '../types'
import { BUTTON_BASE_CLASSES, BUTTON_STYLES, ICON_STYLES } from '../constants'

export const NavigationButton = ({ 
  direction, 
  isDisabled, 
  onClick,
  className = ''
}: NavigationButtonProps) => {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon
  const customClass = direction === 'prev' 
    ? 'swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2'
    : 'swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2'
  
  const buttonStyle = isDisabled ? BUTTON_STYLES.disabled : BUTTON_STYLES.active
  const iconStyle = isDisabled ? ICON_STYLES.disabled : ICON_STYLES.active

  return (
    <button 
      className={`${customClass} ${BUTTON_BASE_CLASSES} ${buttonStyle} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      <Icon className={`w-5 h-5 ${iconStyle}`} />
    </button>
  )
}