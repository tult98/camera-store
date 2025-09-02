"use client"

import { CategoryProductsResponse, FacetsResponse } from "@camera-store/shared-types"
import { apiClient } from "@lib/api-client"
import SkeletonProductControls from "@modules/skeletons/components/skeleton-product-controls"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SkeletonProductList from "@modules/skeletons/templates/skeleton-product-list"
import SkeletonFilterSidebar from "@modules/skeletons/templates/skeleton-filter-sidebar"
import { useCategoryBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { FunnelIcon } from "@heroicons/react/24/outline"
import { Pagination } from "./pagination"
import ProductGrid from "./product-grid"
import ViewToggle from "./product-grid/view-toggle"
import SortDropdown from "./sort-dropdown"
import FilterSidebar from "./filters/filter-sidebar"
import FilterDrawer from "./filters/filter-drawer"
import { useCategoryFilterStore } from "../store/category-filter-store"

interface CategoryPageClientProps {
  categoryId: string
  categoryName: string
  initialProductsData?: CategoryProductsResponse
}

const fetchCategoryProducts = async ({
  categoryId,
  page,
  pageSize,
  sortBy,
  filters,
}: {
  categoryId: string
  page: number
  pageSize: number
  sortBy: string
  filters: any
}) => {
  const productsRequest = {
    category_id: categoryId,
    page,
    page_size: pageSize,
    order_by: sortBy,
    filters,
  }

  const response = await apiClient<CategoryProductsResponse>(
    "/store/category-products",
    {
      method: "POST",
      body: productsRequest,
    }
  )

  return response
}

const fetchCategoryFacets = async ({
  categoryId,
  filters,
}: {
  categoryId: string
  filters: any
}) => {
  const facetsRequest = {
    category_id: categoryId,
    applied_filters: filters,
    include_counts: true,
  }

  const response = await apiClient<FacetsResponse>(
    "/store/facets/aggregate",
    {
      method: "POST",
      body: facetsRequest,
      headers: {
        'region_id': process.env['NEXT_PUBLIC_DEFAULT_REGION_ID'] || 'reg_01J9K0FDQZ8X3N8Q9NBXD5EKPK',
        'currency_code': process.env['NEXT_PUBLIC_DEFAULT_CURRENCY'] || 'usd'
      }
    }
  )

  return response
}

export default function CategoryPageClient({
  categoryId,
  categoryName,
  initialProductsData,
}: CategoryPageClientProps) {
  const [sortBy, setSortBy] = useState("created_at")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const pageSize = 24
  
  const { filters } = useCategoryFilterStore()
  
  // Set breadcrumbs in the layout context
  const categoryHandle = categoryName.toLowerCase().replace(/\s+/g, '-')
  useCategoryBreadcrumbs(categoryName, categoryHandle)

  const { data: productsData, isLoading: isLoadingProducts } = useQuery<CategoryProductsResponse>({
    queryKey: ["category-products", categoryId, page, sortBy, filters],
    queryFn: () =>
      fetchCategoryProducts({ categoryId, page, pageSize, sortBy, filters }),
    initialData: initialProductsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { data: facetsData, isLoading: isLoadingFacets, refetch: refetchFacets } = useQuery<FacetsResponse>({
    queryKey: ["category-facets", categoryId],
    queryFn: () =>
      fetchCategoryFacets({ categoryId, filters: {} }),
    staleTime: 60 * 60 * 1000, // 1 hour - facets structure doesn't change often
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const products = productsData?.items || []
  const facets = facetsData?.facets || []
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Facets data:', { facetsData, facets, isLoadingFacets, filters })
  }
  
  // Calculate pagination from response data
  const totalCount = productsData?.count || 0
  const totalPages = Math.ceil(totalCount / pageSize)
  const pagination = productsData ? {
    currentPage: page,
    totalPages,
    limit: pageSize,
    total: totalCount,
  } : null

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="min-h-screen bg-base-100 w-full">
      {/* Mobile Header with Filter Button */}
      <div className="lg:hidden border-b border-base-300 p-4 sticky top-0 z-40 backdrop-blur-sm bg-base-100/95">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-base-content">{categoryName}</h1>
            {pagination && (
              <p className="text-sm text-base-content/60 mt-1">
                {pagination.total} products available
              </p>
            )}
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="btn btn-primary btn-sm gap-2 shadow-lg"
            aria-label="Open filter menu"
          >
            <FunnelIcon className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-200px)] w-full">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          {isLoadingFacets ? (
            <SkeletonFilterSidebar />
          ) : (
            <FilterSidebar 
              facets={facets}
              loading={isLoadingFacets}
              refetch={refetchFacets}
            />
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 p-6 lg:p-8 w-full">
          {/* Desktop Category Header */}
          <div className="hidden lg:block mb-8">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-base-content mb-2">{categoryName}</h1>
              </div>
            </div>
          </div>

          {/* Product Controls */}
          {isLoadingProducts ? (
            <SkeletonProductControls />
          ) : (
            <div className="bg-base-200/30 rounded-2xl p-4 mb-6 border border-base-300">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  {pagination && (
                    <div>
                      <p className="text-sm font-medium text-base-content">
                        {pagination.total === 0 ? (
                          `0 results found`
                        ) : (
                          `Showing ${(pagination.currentPage - 1) * pagination.limit + 1}–${Math.min(
                            pagination.currentPage * pagination.limit,
                            pagination.total
                          )} of ${pagination.total}`
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <SortDropdown
                    sortBy={sortBy as any}
                    onSortChange={handleSortChange}
                  />
                  <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
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
                  Try adjusting your filters or search terms to find the perfect camera equipment.
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

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        facets={facets}
        loading={isLoadingFacets}
      />
    </div>
  )
}
