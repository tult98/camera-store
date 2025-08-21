
import { notFound } from "next/navigation"
import { Suspense } from "react"
import CategoryPageClient from "@modules/store/components/category-page-client"
import { CategoryProductsResponse, CategoryFacetsResponse, CategoryProductsRequest, CategoryFacetsRequest } from "@lib/hooks/useCategoryData"
import { sdk } from "@lib/config"
import { getCategoryByHandle } from "@lib/data/categories"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SkeletonFilterSidebar from "@modules/skeletons/templates/skeleton-filter-sidebar"
import SkeletonProductControls from "@modules/skeletons/components/skeleton-product-controls"

type Props = {
  params: Promise<{ category: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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
      body: productsRequest,
      next: { revalidate: 300 }
    })

    const facetsResponse = await sdk.client.fetch<CategoryFacetsResponse>('/store/category-facets', {
      method: 'POST',
      body: facetsRequest,
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
  const categoryHandle = params.category
  const category = await getCategoryByHandle(categoryHandle)

  if (!category) {
    notFound()
  }

  const { products: initialProductsData, facets: initialFacetsData } = await fetchCategoryData(category.id)

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
        {/* Page Title Skeleton */}
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-64"></div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <SkeletonFilterSidebar />
          </aside>
          <main className="flex-1">
            <SkeletonProductControls />
            <SkeletonProductGrid numberOfProducts={8} />
          </main>
        </div>
      </div>
    }>
      <CategoryPageClient
        categoryId={category.id}
        categoryName={category.name}
        initialProductsData={initialProductsData || fallbackProducts}
        initialFacetsData={initialFacetsData || fallbackFacets}
      />
    </Suspense>
  )
}
