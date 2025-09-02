import { 
  CategoryProductsRequest, 
  CategoryProductsResponse, 
  FacetsRequest, 
  FacetsResponse 
} from '@camera-store/shared-types'

const API_BASE_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

export async function fetchCategoryProducts(
  request: CategoryProductsRequest
): Promise<CategoryProductsResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/store/category-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
      },
      body: JSON.stringify(request),
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.statusText}`)
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching category products:', error)
    return null
  }
}

export async function fetchCategoryFacets(
  request: FacetsRequest
): Promise<FacetsResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/store/facets/aggregate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
        'region_id': 'reg_01J9K0FDQZ8X3N8Q9NBXD5EKPK',
        'currency_code': 'usd'
      },
      body: JSON.stringify(request),
      next: { revalidate: 300 }
    })

    if (!response.ok) {
      console.error(`Failed to fetch facets: ${response.statusText}`)
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching category facets:', error)
    return null
  }
}

export async function fetchCategoryData(categoryId: string) {
  const [products, facets] = await Promise.all([
    fetchCategoryProducts({
      category_id: categoryId,
      page: 1,
      page_size: 24,
      order_by: '-created_at',
      filters: {}
    }),
    fetchCategoryFacets({
      category_id: categoryId,
      applied_filters: {},
      include_counts: true
    })
  ])

  return { products, facets }
}