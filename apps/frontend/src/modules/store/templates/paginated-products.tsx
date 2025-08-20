import { listProductsWithSort } from "@lib/data/products"
import { getDefaultRegion } from "@lib/data/regions"
import { getAllMockProducts, getMockProductsByCategory } from "@lib/data/mock-products"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import ProductGridClient from "@modules/store/components/product-grid-client"
import { sortProducts } from "@lib/util/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getDefaultRegion()

  let products, count, totalPages
  
  try {
    const result = await listProductsWithSort({
      page,
      queryParams,
      sortBy,
    })
    products = result.response.products
    count = result.response.count
    totalPages = Math.ceil(count / PRODUCT_LIMIT)
  } catch (error) {
    console.log("Using mock data for products")
    const allProducts = getAllMockProducts()
    const sortedProducts = sortProducts(allProducts, sortBy || "created_at")
    
    const startIndex = (page - 1) * PRODUCT_LIMIT
    const endIndex = startIndex + PRODUCT_LIMIT
    
    products = sortedProducts.slice(startIndex, endIndex)
    count = allProducts.length
    totalPages = Math.ceil(count / PRODUCT_LIMIT)
  }

  if (!products || products.length === 0) {
    const allProducts = getAllMockProducts()
    const sortedProducts = sortProducts(allProducts, sortBy || "created_at")
    
    const startIndex = (page - 1) * PRODUCT_LIMIT
    const endIndex = startIndex + PRODUCT_LIMIT
    
    products = sortedProducts.slice(startIndex, endIndex)
    count = allProducts.length
    totalPages = Math.ceil(count / PRODUCT_LIMIT)
  }

  return (
    <>
      <div data-testid="products-list">
        <ProductGridClient products={products} />
      </div>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
