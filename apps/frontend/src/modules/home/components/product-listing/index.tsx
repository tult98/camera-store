import { sdk } from "@lib/config"
import { getDefaultRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { Text, Heading } from "@medusajs/ui"
import { CubeIcon } from "@heroicons/react/24/outline"

export default async function ProductListing({
  title = "Featured Products",
  limit = 12,
}: {
  title?: string
  limit?: number
}) {
  let products: HttpTypes.StoreProduct[] = []
  
  try {
    // Get default region for single-region store
    const region = await getDefaultRegion()
    
    const response = await sdk.store.product.list({
      limit,
      region_id: region?.id,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
    })
    products = response.products || []
  } catch (error) {
    console.error("Failed to fetch products:", error)
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <CubeIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">
              Please make sure your Medusa backend is running on http://localhost:9000
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="mb-8">
        <Heading level="h2" className="text-3xl font-bold text-ui-fg-base mb-2">
          {title}
        </Heading>
        <Text className="text-ui-fg-subtle">
          Discover our collection of premium Fujifilm cameras and accessories
        </Text>
      </div>
      
      <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-6 gap-y-8">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {product.thumbnail ? (
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{product.title}</h3>
                {product.variants && product.variants.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {product.variants[0].calculated_price?.calculated_amount ? (
                        `${product.variants[0].calculated_price.currency_code?.toUpperCase()} ${(product.variants[0].calculated_price.calculated_amount / 100).toFixed(2)}`
                      ) : (
                        'Price available on request'
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length >= limit && (
        <div className="text-center mt-12">
          <a 
            href="/store" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            View All Products
          </a>
        </div>
      )}
    </div>
  )
}