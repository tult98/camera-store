export interface CameraFilters {
  brand: string[]
  sensorSize: string[]
  megapixels: { min: number; max: number }
  videoCapabilities: string[]
  mountType: string[]
  priceRange: { min: number; max: number }
  availability: string[]
}

export interface LensFilters {
  focalLength: { min: number; max: number }
  maxAperture: number
  lensType: string[]
  imageStabilization: boolean
  mountCompatibility: string[]
}

export interface FilterState extends CameraFilters, LensFilters {
  sortBy: string
  page: number
  limit: number
  inStock?: boolean
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterGroup {
  key: string
  label: string
  type: 'checkbox' | 'range' | 'toggle' | 'select'
  options?: FilterOption[]
  range?: {
    min: number
    max: number
    step?: number
    unit?: string
  }
}

export interface ActiveFilter {
  key: string
  label: string
  value: string
  displayValue: string
}

export const SENSOR_SIZE_OPTIONS: FilterOption[] = [
  { value: 'full-frame', label: 'Full Frame' },
  { value: 'aps-c', label: 'APS-C' },
  { value: 'micro-four-thirds', label: 'Micro Four Thirds' },
  { value: '1-inch', label: '1 inch' },
  { value: 'medium-format', label: 'Medium Format' }
]

export const VIDEO_CAPABILITY_OPTIONS: FilterOption[] = [
  { value: '4k', label: '4K' },
  { value: '6k', label: '6K' },
  { value: '8k', label: '8K' },
  { value: 'no-video', label: 'No Video' }
]

export const MOUNT_TYPE_OPTIONS: FilterOption[] = [
  { value: 'canon-ef', label: 'Canon EF' },
  { value: 'canon-rf', label: 'Canon RF' },
  { value: 'nikon-f', label: 'Nikon F' },
  { value: 'nikon-z', label: 'Nikon Z' },
  { value: 'sony-e', label: 'Sony E' },
  { value: 'sony-a', label: 'Sony A' },
  { value: 'micro-43', label: 'Micro 4/3' },
  { value: 'fujifilm-x', label: 'Fujifilm X' }
]

export const AVAILABILITY_OPTIONS: FilterOption[] = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'pre-order', label: 'Pre-Order' },
  { value: 'special-order', label: 'Special Order' }
]

export const LENS_TYPE_OPTIONS: FilterOption[] = [
  { value: 'prime', label: 'Prime' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'macro', label: 'Macro' },
  { value: 'fisheye', label: 'Fisheye' },
  { value: 'telephoto', label: 'Telephoto' },
  { value: 'wide-angle', label: 'Wide Angle' }
]