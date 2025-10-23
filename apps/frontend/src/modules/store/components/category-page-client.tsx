"use client"

import { Brand, CategoryProductsResponse } from "@camera-store/shared-types"
import { apiClient } from "@lib/api-client"
import { HttpTypes } from "@medusajs/types"
import { useCategoryBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SkeletonProductList from "@modules/skeletons/templates/skeleton-product-list"
import { useQuery } from "@tanstack/react-query"
import { useCategoryFilterStore } from "../store/category-filter-store"
import CategoryBrandsSection from "./category-brands-section"
import CategorySubcategoriesSection from "./category-subcategories-section"
import EmptyProductState from "./empty-product-state"
import { Pagination } from "./pagination"
import ProductControls from "./product-controls"
import ProductGrid from "./product-grid"

interface CategoryPageClientProps {
  categoryId: string
  categoryName: string
  brands: Brand[]
  subcategories: HttpTypes.StoreProductCategory[]
  initialProductsData?: CategoryProductsResponse
}

const fetchCategoryProducts = async (requestBody: any) => {
  const response = await apiClient<CategoryProductsResponse>(
    "/store/category-products",
    {
      method: "POST",
      body: requestBody,
    }
  )

  return response
}

export default function CategoryPageClient({
  categoryId,
  categoryName,
  brands,
  subcategories,
  initialProductsData,
}: CategoryPageClientProps) {
  const {
    filters,
    sortBy,
    page,
    pageSize,
    viewMode,
    searchQuery,
    brandFilter,
    setSortBy,
    setPage,
    setViewMode,
    clearAllFilters,
    getApiRequestBody,
  } = useCategoryFilterStore()

  const categoryHandle = categoryName.toLowerCase().replace(/\s+/g, "-")
  useCategoryBreadcrumbs(categoryName, categoryHandle)

  const activeFilterCount =
    (filters.price ? 1 : 0) +
    (filters.tags?.length || 0) +
    (filters.availability?.length || 0) +
    (filters.metadata
      ? Object.values(filters.metadata).reduce(
          (acc, arr) => acc + arr.length,
          0
        )
      : 0)

  const {
    data: productsData,
    isFetching,
    isLoading,
  } = useQuery<CategoryProductsResponse>({
    queryKey: [
      "category-products",
      categoryId,
      page,
      sortBy,
      searchQuery,
      brandFilter,
      JSON.stringify(filters),
    ],
    queryFn: () => {
      const requestBody = getApiRequestBody(categoryId)
      return fetchCategoryProducts(requestBody)
    },
    initialData: initialProductsData,
    staleTime: 0,
  })

  const isLoadingProducts = isFetching || isLoading

  const products = productsData?.items || []
  const totalCount = productsData?.count || 0
  const totalPages = Math.ceil(totalCount / pageSize)
  const pagination = productsData
    ? {
        currentPage: page,
        totalPages,
        limit: pageSize,
        total: totalCount,
      }
    : null

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as any)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleClearAllFilters = () => {
    clearAllFilters()
  }

  return (
    <div className="min-h-screen bg-base-100 w-full">
      <div className="lg:hidden border-b border-base-300 p-4 sticky top-0 z-40 backdrop-blur-sm bg-base-100/95">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-base-content">
              {categoryName}
            </h1>
            {pagination && (
              <p className="text-sm text-base-content/60 mt-1">
                {pagination.total} products available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
          <CategoryBrandsSection brands={brands} />
          <CategorySubcategoriesSection subcategories={subcategories} />

          <ProductControls
            pagination={pagination}
            activeFilterCount={activeFilterCount}
            categoryId={categoryId}
            sortBy={sortBy}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
            isLoading={isLoadingProducts}
          />

          {isLoadingProducts ? (
            viewMode === "grid" ? (
              <SkeletonProductGrid numberOfProducts={pageSize} />
            ) : (
              <SkeletonProductList numberOfProducts={Math.min(pageSize, 6)} />
            )
          ) : products.length === 0 ? (
            <EmptyProductState
              hasActiveFilters={activeFilterCount > 0 || !!brandFilter}
              hasSearchQuery={!!searchQuery}
              onClearFilters={handleClearAllFilters}
            />
          ) : (
            <>
              <ProductGrid products={products || []} viewMode={viewMode} />

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="bg-base-200/30 rounded-2xl p-4 border border-base-300">
                    <Pagination
                      page={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
