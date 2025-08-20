
import { notFound } from "next/navigation"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import CategoryTemplate from "@modules/categories/templates"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

// Mock category data for demo purposes
const getMockCategory = (categoryHandle: string) => {
  const categories = {
    'may-anh': {
      id: '1',
      name: 'Máy Ảnh',
      handle: 'may-anh',
      description: 'Máy ảnh chuyên nghiệp cho mọi nhu cầu và trình độ',
      category_children: [
        { id: '1-1', name: 'Máy Ảnh DSLR', handle: 'may-anh-dslr', description: 'Máy ảnh gương lật truyền thống với kính ngắm quang học' },
        { id: '1-2', name: 'Máy Ảnh Mirrorless', handle: 'may-anh-mirrorless', description: 'Máy ảnh không gương nhỏ gọn hiện đại' },
        { id: '1-3', name: 'Máy Ảnh Compact', handle: 'may-anh-compact', description: 'Máy ảnh nhỏ gọn dễ sử dụng' },
        { id: '1-4', name: 'Máy Quay Hành Động', handle: 'may-quay-hanh-dong', description: 'Máy quay bền bỉ cho phiêu lưu' },
      ],
      products: [],
      parent_category: null
    },
    'cameras': {
      id: '1',
      name: 'Digital Cameras',
      handle: 'cameras',
      description: 'Professional cameras for every need and skill level',
      category_children: [
        { id: '1-1', name: 'DSLR Cameras', handle: 'dslr', description: 'Traditional mirror cameras with optical viewfinders' },
        { id: '1-2', name: 'Mirrorless Cameras', handle: 'mirrorless', description: 'Compact modern cameras without mirrors' },
        { id: '1-3', name: 'Point & Shoot', handle: 'point-shoot', description: 'Easy-to-use compact cameras' },
        { id: '1-4', name: 'Action Cameras', handle: 'action', description: 'Adventure-ready rugged cameras' },
      ],
      products: [],
      parent_category: null
    },
    'ong-kinh': {
      id: '2',
      name: 'Ống Kính',
      handle: 'ong-kinh',
      description: 'Ống kính chất lượng cao cho nhiếp ảnh tuyệt đẹp',
      category_children: [
        { id: '2-1', name: 'Ống Kính Prime', handle: 'ong-kinh-prime', description: 'Ống kính tiêu cự cố định' },
        { id: '2-2', name: 'Ống Kính Zoom', handle: 'ong-kinh-zoom', description: 'Ống kính tiêu cự biến thiên' },
        { id: '2-3', name: 'Ống Kính Macro', handle: 'ong-kinh-macro', description: 'Ống kính chụp cận cảnh' },
        { id: '2-4', name: 'Ống Kính Telephoto', handle: 'ong-kinh-telephoto', description: 'Ống kính chụp xa' },
      ],
      products: [],
      parent_category: null
    },
    'lenses': {
      id: '2',
      name: 'Camera Lenses',
      handle: 'lenses',
      description: 'High-quality lenses for stunning photography',
      category_children: [
        { id: '2-1', name: 'Prime Lenses', handle: 'prime', description: 'Fixed focal length lenses' },
        { id: '2-2', name: 'Zoom Lenses', handle: 'zoom', description: 'Variable focal length lenses' },
        { id: '2-3', name: 'Macro Lenses', handle: 'macro', description: 'Close-up photography lenses' },
        { id: '2-4', name: 'Telephoto Lenses', handle: 'telephoto', description: 'Long-distance photography lenses' },
      ],
      products: [],
      parent_category: null
    },
    'phu-kien': {
      id: '3',
      name: 'Phụ Kiện Máy Ảnh',
      handle: 'phu-kien',
      description: 'Phụ kiện thiết yếu cho bộ thiết bị nhiếp ảnh của bạn',
      category_children: [
        { id: '3-1', name: 'Chân Máy', handle: 'chan-may', description: 'Giá đỡ ổn định cho máy ảnh' },
        { id: '3-2', name: 'Thẻ Nhớ', handle: 'the-nho', description: 'Lưu trữ ảnh và video' },
        { id: '3-3', name: 'Túi Máy Ảnh', handle: 'tui-may-anh', description: 'Bảo vệ và mang theo thiết bị' },
        { id: '3-4', name: 'Filter', handle: 'filter', description: 'Nâng cao chất lượng ảnh' },
      ],
      products: [],
      parent_category: null
    },
    'accessories': {
      id: '3',
      name: 'Camera Accessories',
      handle: 'accessories',
      description: 'Essential accessories for your photography setup',
      category_children: [
        { id: '3-1', name: 'Tripods', handle: 'tripods', description: 'Stable support for your camera' },
        { id: '3-2', name: 'Memory Cards', handle: 'memory-cards', description: 'Store your photos and videos' },
        { id: '3-3', name: 'Camera Bags', handle: 'bags', description: 'Protect and carry your equipment' },
        { id: '3-4', name: 'Filters', handle: 'filters', description: 'Enhance your photography' },
      ],
      products: [],
      parent_category: null
    }
  } as const

  return categories[categoryHandle as keyof typeof categories] || null
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  // For demo purposes, use the first category handle
  const categoryHandle = params.category[0]
  const productCategory = getMockCategory(categoryHandle)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory as any}
      {...(sortBy && { sortBy })}
      {...(page && { page })}
      countryCode="us" // Mock country code
    />
  )
}
