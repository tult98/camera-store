import { 
  CategoryProductsRequest, 
  CategoryProductsResponse
} from '@camera-store/shared-types'

const API_BASE_URL = process.env['NEXT_PUBLIC_MEDUSA_BACKEND_URL'] || 'http://localhost:9000'

export async function fetchCategoryProducts(
  request: CategoryProductsRequest
): Promise<CategoryProductsResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/store/category-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': process.env['NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY'] || ''
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

