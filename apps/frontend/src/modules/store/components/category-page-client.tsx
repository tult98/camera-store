'use client'

import { CategoryFacetsResponse, CategoryProductsResponse, useCategoryDataWithInitial } from '@lib/hooks/useCategoryData'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useCategoryFilterStore } from '../store/category-filter-store'
import { FilterSidebar } from './filters'
import ActiveFilters from './filters/active-filters'
import { Pagination } from './pagination'
import ProductGrid from './product-grid'
import ViewToggle from './product-grid/view-toggle'
import SortDropdown from './sort-dropdown'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import SkeletonProductList from '@modules/skeletons/templates/skeleton-product-list'
import SkeletonFilterSidebar from '@modules/skeletons/templates/skeleton-filter-sidebar'
import SkeletonProductControls from '@modules/skeletons/components/skeleton-product-controls'
import SkeletonActiveFilters from '@modules/skeletons/components/skeleton-active-filters'

interface CategoryPageClientProps {
  categoryId: string
  categoryName: string
  initialProductsData?: CategoryProductsResponse
  initialFacetsData?: CategoryFacetsResponse
}

export default function CategoryPageClient({ 
  categoryId, 
  categoryName,
  initialProductsData,
  initialFacetsData 
}: CategoryPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const {
    filters,
    sortBy,
    page,
    pageSize,
    viewMode,
    searchQuery,
    initStateFromUrl,
    getUrlSearchParams,
    getApiRequestBody,
    setPage,
    setSortBy,
    setViewMode
  } = useCategoryFilterStore()

  useEffect(() => {
    initStateFromUrl(searchParams)
  }, [])

  const apiRequest = getApiRequestBody(categoryId)
  
  const { productsQuery, facetsQuery, isLoading } = useCategoryDataWithInitial(
    apiRequest,
    initialProductsData,
    initialFacetsData
  )

  useEffect(() => {
    const newParams = getUrlSearchParams()
    const newUrl = newParams.toString() 
      ? `${pathname}?${newParams.toString()}` 
      : pathname
    
    if (newUrl !== `${pathname}${window.location.search}`) {
      router.push(newUrl, { scroll: false })
    }
  }, [filters, sortBy, page, pageSize, viewMode, searchQuery, pathname])

  const productsData = productsQuery.data as CategoryProductsResponse || { products: [], pagination: { total: 0, limit: 24, offset: 0, totalPages: 0, currentPage: 1 } }
  const products = productsData.products
  const pagination = productsData.pagination
  const facetsData = facetsQuery.data as CategoryFacetsResponse || { facets: [] }
  const facets = facetsData.facets

  const hasActiveFilters = (
    (filters.tags && filters.tags.length > 0) ||
    (filters.availability && filters.availability.length > 0) ||
    (filters.metadata && Object.keys(filters.metadata).length > 0) ||
    (filters.price?.min !== undefined || filters.price?.max !== undefined) ||
    searchQuery
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <div className="text-sm breadcrumbs">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/store">Store</a></li>
            <li>{categoryName}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-80">
          {facetsQuery.isLoading ? (
            <SkeletonFilterSidebar />
          ) : (
            <FilterSidebar 
              facets={facets}
              loading={facetsQuery.isLoading}
              refetch={facetsQuery.refetch}
            />
          )}
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <SkeletonProductControls />
          ) : (
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                {pagination && (
                  <p className="text-sm text-base-content/70">
                    Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} products
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <SortDropdown 
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
                <ViewToggle 
                  viewMode={viewMode} 
                  onViewModeChange={setViewMode} 
                />
              </div>
            </div>
          )}
          
          {isLoading ? (
            <SkeletonActiveFilters />
          ) : hasActiveFilters && (
            <div className="mb-4">
              <ActiveFilters />
            </div>
          )}

          {isLoading ? (
            viewMode === 'grid' ? (
              <SkeletonProductGrid numberOfProducts={pageSize} />
            ) : (
              <SkeletonProductList numberOfProducts={Math.min(pageSize, 6)} />
            )
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-base-content/70 mb-4">
                No products found matching your criteria
              </p>
              {hasActiveFilters && (
                <button 
                  onClick={() => useCategoryFilterStore.getState().clearAllFilters()}
                  className="btn btn-primary"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <ProductGrid 
                products={products}
                viewMode={viewMode}
              />
              
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}