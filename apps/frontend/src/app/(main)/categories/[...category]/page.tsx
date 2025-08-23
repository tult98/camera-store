import { CategoryProductsResponse } from "@camera-store/shared-types"
import { apiClient } from "@lib/api-client"
import { getCategoryByHandle } from "@lib/data/categories"
import SkeletonProductControls from "@modules/skeletons/components/skeleton-product-controls"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import CategoryPageClient from "@modules/store/components/category-page-client"
import { notFound } from "next/navigation"
import { Suspense } from "react"

type Props = {
  params: Promise<{ category: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function fetchCategoryProducts(categoryId: string): Promise<any> {
  try {
    const productsRequest = {
      category_id: categoryId,
      page: 1,
      page_size: 24,
      order_by: "created_at",
      filters: {},
    }

    const productsResponse = await apiClient<CategoryProductsResponse>(
      "/store/category-products",
      {
        method: "POST",
        body: productsRequest,
        next: { revalidate: 300 },
      }
    )

    return productsResponse
  } catch (error) {
    console.error("Error fetching category products:", error)
    return null
  }
}

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const categoryHandle = params.category
  const category = await getCategoryByHandle(categoryHandle)

  if (!category) {
    notFound()
  }

  const initialProductsData = await fetchCategoryProducts(category.id)

  const fallbackProducts: CategoryProductsResponse = {
    items: [],
    limit: 24,
    offset: 0,
    count: 0,
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-64"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <main className="flex-1">
              <SkeletonProductControls />
              <SkeletonProductGrid numberOfProducts={8} />
            </main>
          </div>
        </div>
      }
    >
      <CategoryPageClient
        categoryId={category.id}
        categoryName={category.name}
        initialProductsData={initialProductsData || fallbackProducts}
      />
    </Suspense>
  )
}
