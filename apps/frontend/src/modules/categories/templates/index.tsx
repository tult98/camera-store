import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ActiveFilters from "@modules/store/components/filters/active-filters"
import MobileFilterControls from "../components/mobile-filter-controls"
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
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
          <h1 data-testid="category-page-title">{category.name}</h1>
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        
        {/* Mobile Filter Controls */}
        <MobileFilterControls 
          availableBrands={availableBrands}
          categoryType={categoryType}
        />
        
        {/* Active Filters Display */}
        <ActiveFilters />
        
        {/* Subcategory Navigation */}
        {category.category_children && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 small:grid-cols-4 gap-4">
              {category.category_children?.map((c) => (
                <LocalizedClientLink key={c.id} href={`/categories/${c.handle}`}>
                  <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="card-body p-4 text-center">
                      <h3 className="font-semibold text-sm">{c.name}</h3>
                      {c.description && (
                        <p className="text-xs text-base-content/60 mt-1 line-clamp-2">
                          {c.description}
                        </p>
                      )}
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        )}
        
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
