import { 
  CategoryProductsRequest, 
  CategoryProductsResponse, 
  CategoryFacetsRequest, 
  CategoryFacetsResponse 
} from '@/types/category'

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
  request: CategoryFacetsRequest
): Promise<CategoryFacetsResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/store/category-facets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''
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
      sort_by: 'created_at',
      sort_direction: 'desc',
      filters: {}
    }),
    fetchCategoryFacets({
      category_id: categoryId,
      filters: {}
    })
  ])

  return { products, facets }
}