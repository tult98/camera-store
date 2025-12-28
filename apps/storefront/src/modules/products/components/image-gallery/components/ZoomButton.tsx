import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { ZoomButtonProps } from '../types'

export const ZoomButton = ({ onClick }: ZoomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="absolute z-1 top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm border border-gray-200 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
      aria-label="View full size"
    >
      <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
    </button>
  )
}