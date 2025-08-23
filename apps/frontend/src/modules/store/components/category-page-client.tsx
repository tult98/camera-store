"use client"

import { CategoryProductsResponse } from "@camera-store/shared-types"
import { apiClient } from "@lib/api-client"
import SkeletonProductControls from "@modules/skeletons/components/skeleton-product-controls"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import SkeletonProductList from "@modules/skeletons/templates/skeleton-product-list"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Pagination } from "./pagination"
import ProductGrid from "./product-grid"
import ViewToggle from "./product-grid/view-toggle"
import SortDropdown from "./sort-dropdown"

interface CategoryPageClientProps {
  categoryId: string
  categoryName: string
  initialProductsData?: any
}

const fetchCategoryProducts = async ({ categoryId, page, pageSize, sortBy }: {
  categoryId: string
  page: number
  pageSize: number
  sortBy: string
}) => {
  const productsRequest = {
    category_id: categoryId,
    page,
    page_size: pageSize,
    order_by: sortBy,
    filters: {},
  }

  const response = await apiClient<CategoryProductsResponse>("/store/category-products", {
    method: "POST",
    body: productsRequest,
  })

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
  const pageSize = 24

  const { data, isLoading } = useQuery<CategoryProductsResponse>({
    queryKey: ['category-products', categoryId, page, sortBy],
    queryFn: () => fetchCategoryProducts({ categoryId, page, pageSize, sortBy }),
    initialData: initialProductsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const products = data?.data || []
  const metadata = data?.metadata
  const pagination = metadata ? {
    currentPage: page,
    totalPages: Math.ceil(metadata.count / pageSize),
    total: metadata.count,
    limit: pageSize,
  } : null

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/store">Store</a>
            </li>
            <li>{categoryName}</li>
          </ul>
        </div>
      </div>

      <main className="flex-1">
        {isLoading ? (
          <SkeletonProductControls />
        ) : (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              {pagination && (
                <p className="text-sm text-base-content/70">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} products
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <SortDropdown sortBy={sortBy as any} onSortChange={handleSortChange} />
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          </div>
        )}

        {isLoading ? (
          viewMode === "grid" ? (
            <SkeletonProductGrid numberOfProducts={pageSize} />
          ) : (
            <SkeletonProductList numberOfProducts={Math.min(pageSize, 6)} />
          )
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-base-content/70 mb-4">
              No products found in this category
            </p>
          </div>
        ) : (
          <>
            <ProductGrid products={products || []} viewMode={viewMode} />

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  page={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
