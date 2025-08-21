'use client'

import { CategoryFacetsResponse, CategoryProductsResponse, useCategoryDataWithInitial } from '@lib/hooks/useCategoryData'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useCategoryFilterStore } from '../store/category-filter-store'
import { FilterSidebar } from './filters'
import ActiveFilters from './filters/active-filters'
import { Pagination } from './pagination'
import ProductGrid from './product-grid'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

interface CategoryPageClientProps {
  categoryId: string
  categoryName: string
  initialProductsData?: CategoryProductsResponse
  initialFacetsData?: CategoryFacetsResponse
}

function CategoryPageContent({ 
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
    setPage
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

  const products = productsQuery.data?.products || []
  const pagination = productsQuery.data?.pagination
  const facets = facetsQuery.data?.facets || []

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
          <FilterSidebar 
            facets={facets}
            loading={facetsQuery.isLoading}
            refetch={facetsQuery.refetch}
          />
        </aside>

        <main className="flex-1">
          {hasActiveFilters && (
            <div className="mb-4">
              <ActiveFilters />
            </div>
          )}

          {isLoading ? (
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

export default function CategoryPageClient(props: CategoryPageClientProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoryPageContent {...props} />
    </QueryClientProvider>
  )
}