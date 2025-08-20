import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ActiveFilters from "@modules/store/components/filters/active-filters"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  // Determine category type for appropriate filters
  const getCategoryType = (categoryName: string): 'cameras' | 'lenses' | 'accessories' => {
    const name = categoryName.toLowerCase()
    if (name.includes('camera') || name.includes('dslr') || name.includes('mirrorless')) {
      return 'cameras'
    } else if (name.includes('lens') || name.includes('objective')) {
      return 'lenses'
    }
    return 'accessories'
  }

  const categoryType = getCategoryType(category.name)

  // Mock available brands - in real implementation, this would come from the backend
  const availableBrands = [
    { value: 'canon', label: 'Canon', count: 45 },
    { value: 'nikon', label: 'Nikon', count: 38 },
    { value: 'sony', label: 'Sony', count: 52 },
    { value: 'fujifilm', label: 'Fujifilm', count: 23 },
    { value: 'olympus', label: 'Olympus', count: 18 },
    { value: 'panasonic', label: 'Panasonic', count: 15 },
    { value: 'leica', label: 'Leica', count: 8 },
    { value: 'pentax', label: 'Pentax', count: 12 }
  ]

  return (
    <div
      className="flex flex-col lg:flex-row lg:gap-8 py-6"
      data-testid="category-container"
    >
      <aside className="lg:w-80 lg:flex-shrink-0">
        <RefinementList 
          sortBy={sort} 
          data-testid="sort-by-container"
          availableBrands={availableBrands}
          categoryType={categoryType}
        />
      </aside>
      <div className="flex-1">
        <div className="mb-12">
          {/* Breadcrumb */}
          <div className="flex flex-row mb-6 text-sm text-ui-fg-subtle gap-2">
            {parents &&
              parents.map((parent) => (
                <span key={parent.id} className="flex items-center gap-2">
                  <LocalizedClientLink
                    className="hover:text-black transition-colors"
                    href={`/categories/${parent.handle}`}
                    data-testid="sort-by-link"
                  >
                    {parent.name}
                  </LocalizedClientLink>
                  <span>/</span>
                </span>
              ))}
          </div>
          
          {/* Main Title */}
          <h1 
            data-testid="category-page-title" 
            className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
          >
            {category.name}
          </h1>
        </div>
        {category.description && (
          <div className="mb-12 max-w-3xl">
            <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed">
              {category.description}
            </p>
          </div>
        )}
        
        
        {/* Active Filters Display */}
        <ActiveFilters />
        
        
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
          />
        </Suspense>
      </div>
    </div>
  )
}
