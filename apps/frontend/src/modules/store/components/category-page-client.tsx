"use client"

import { Brand, CategoryProductsResponse } from "@camera-store/shared-types"
import { HttpTypes } from "@medusajs/types"
import { FunnelIcon } from "@heroicons/react/24/outline"
import { apiClient } from "@lib/api-client"
import { useCategoryBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"
import SkeletonProductControls from "@modules/skeletons/components/skeleton-product-controls"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SkeletonProductList from "@modules/skeletons/templates/skeleton-product-list"
import { useQuery } from "@tanstack/react-query"
import { useCategoryFilterStore } from "../store/category-filter-store"
import CategoryBrandsSection from "./category-brands-section"
import CategorySubcategoriesSection from "./category-subcategories-section"
import FilterDropdown from "./filter-dropdown"
import { Pagination } from "./pagination"
import ProductGrid from "./product-grid"
import ViewToggle from "./product-grid/view-toggle"
import SortDropdown from "./sort-dropdown"

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
    getApiRequestBody,
  } = useCategoryFilterStore()

  const categoryHandle = categoryName.toLowerCase().replace(/\s+/g, "-")
  useCategoryBreadcrumbs(categoryName, categoryHandle)

  const activeFilterCount =
    (filters.price ? 1 : 0) +
    (filters.tags?.length || 0) +
    (filters.availability?.length || 0) +
    (filters.metadata ? Object.values(filters.metadata).reduce((acc, arr) => acc + arr.length, 0) : 0)

  const { data: productsData, isLoading: isLoadingProducts } =
    useQuery<CategoryProductsResponse>({
      queryKey: [
        "category-products",
        categoryId,
        page,
        sortBy,
        searchQuery,
        brandFilter,
      ],
      queryFn: () => {
        const requestBody = getApiRequestBody(categoryId)
        return fetchCategoryProducts(requestBody)
      },
      initialData: !brandFilter ? initialProductsData : undefined,
      staleTime: 0,
    })

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

          {isLoadingProducts ? (
            <SkeletonProductControls />
          ) : (
            <div className="bg-base-200/30 rounded-2xl p-4 mb-6 border border-base-300">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  {pagination && (
                    <div>
                      <p className="text-sm font-medium text-base-content">
                        {pagination.total === 0
                          ? `0 results found`
                          : `Showing ${
                              (pagination.currentPage - 1) * pagination.limit +
                              1
                            }–${Math.min(
                              pagination.currentPage * pagination.limit,
                              pagination.total
                            )} of ${pagination.total}`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="dropdown">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-outline btn-primary hover:btn-primary transition-all duration-200 gap-2"
                      aria-label="Filter products"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <FunnelIcon className="w-4 h-4" />
                      <span>
                        Filter
                        {activeFilterCount > 0 && ` (${activeFilterCount})`}
                      </span>
                    </div>
                    <FilterDropdown categoryId={categoryId} activeFilterCount={activeFilterCount} />
                  </div>
                  <div className="flex-1 lg:flex-initial">
                    <SortDropdown
                      sortBy={sortBy as any}
                      onSortChange={handleSortChange}
                    />
                  </div>
                  <div className="hidden lg:block">
                    <ViewToggle
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoadingProducts ? (
            viewMode === "grid" ? (
              <SkeletonProductGrid numberOfProducts={pageSize} />
            ) : (
              <SkeletonProductList numberOfProducts={Math.min(pageSize, 6)} />
            )
          ) : products.length === 0 ? (
            <div className="w-full min-h-[400px] flex items-center justify-center py-16">
              <div className="text-center w-full">
                <FunnelIcon className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-base-content mb-2">
                  No cameras found
                </h3>
                <p className="text-base-content/70 max-w-md mx-auto">
                  Try adjusting your brand selection or search terms to find the
                  perfect camera equipment.
                </p>
              </div>
            </div>
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
