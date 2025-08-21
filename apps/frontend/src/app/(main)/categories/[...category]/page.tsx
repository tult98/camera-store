
import { notFound } from "next/navigation"
import { Suspense } from "react"
import CategoryPageClient from "@modules/store/components/category-page-client"
import { CategoryProductsResponse, CategoryFacetsResponse, CategoryProductsRequest, CategoryFacetsRequest } from "@lib/hooks/useCategoryData"
import { sdk } from "@lib/config"

type Props = {
  params: Promise<{ category: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

async function fetchCategoryData(categoryId: string): Promise<{
  products: CategoryProductsResponse | null
  facets: CategoryFacetsResponse | null
}> {
  try {
    const productsRequest: CategoryProductsRequest = {
      category_id: categoryId,
      page: 1,
      page_size: 24,
      sort_by: 'created_at',
      sort_direction: 'desc',
      filters: {}
    }

    const facetsRequest: CategoryFacetsRequest = {
      category_id: categoryId,
      filters: {}
    }

    const productsResponse = await sdk.client.fetch<CategoryProductsResponse>('/store/category-products', {
      method: 'POST',
      body: JSON.stringify(productsRequest),
      next: { revalidate: 300 }
    })

    const facetsResponse = await sdk.client.fetch<CategoryFacetsResponse>('/store/category-facets', {
      method: 'POST',
      body: JSON.stringify(facetsRequest),
      next: { revalidate: 300 }
    })

    return { products: productsResponse, facets: facetsResponse }
  } catch (error) {
    console.error('Error fetching category data:', error)
    return { products: null, facets: null }
  }
}

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const categoryHandle = params.category[0]
  const productCategory = getMockCategory(categoryHandle)

  if (!productCategory) {
    notFound()
  }

  const { products: initialProductsData, facets: initialFacetsData } = await fetchCategoryData(productCategory.id)

  const fallbackProducts: CategoryProductsResponse = {
    pagination: {
      total: 0,
      limit: 24,
      offset: 0,
      totalPages: 0,
      currentPage: 1
    },
    products: []
  }

  const fallbackFacets: CategoryFacetsResponse = {
    facets: []
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="skeleton h-8 w-48 mb-4"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <div className="skeleton h-96 w-full"></div>
          </aside>
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card bg-base-100 shadow">
                  <div className="skeleton h-48 w-full"></div>
                  <div className="card-body">
                    <div className="skeleton h-4 w-3/4 mb-2"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    }>
      <CategoryPageClient
        categoryId={productCategory.id}
        categoryName={productCategory.name}
        initialProductsData={initialProductsData || fallbackProducts}
        initialFacetsData={initialFacetsData || fallbackFacets}
      />
    </Suspense>
  )
}
