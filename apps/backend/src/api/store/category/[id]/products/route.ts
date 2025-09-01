import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id: categoryId } = req.params
  const {
    sortBy = 'popularity',
    page = '1',
    limit = '24',
    q
  } = req.query as Record<string, string>

  // Input validation
  if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
    return res.status(400).json({
      error: "Valid category ID is required"
    })
  }

  // Sanitize search query
  const sanitizedQuery = q ? q.trim().slice(0, 100) : undefined

  const currentPage = parseInt(page, 10)
  const itemsPerPage = parseInt(limit, 10)
  const offset = (currentPage - 1) * itemsPerPage

  try {
    const productModule = req.scope.resolve(Modules.PRODUCT)

    // Build product filters
    const productFilters: any = {
      categories: { id: [categoryId] }
    }

    // Add text search if provided
    if (sanitizedQuery) {
      productFilters.title = {
        $ilike: `%${sanitizedQuery}%`
      }
    }

    // Get products in category
    const products = await productModule.listProducts(productFilters, {
      relations: ["variants", "variants.calculated_price"],
      take: 1000
    })

    let filteredProducts = products

    // TODO: Apply facet filters when FacetAggregationService is ready
    // if (facet_filters) {
    //   const filters = JSON.parse(facet_filters)
    //   filteredProducts = await applyFacetFilters(products, filters)
    // }

    // Apply sorting
    filteredProducts = applySorting(filteredProducts, sortBy)

    // Pagination
    const totalProducts = filteredProducts.length
    const totalPages = Math.ceil(totalProducts / itemsPerPage)
    const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage)

    res.json({
      pagination: {
        total: totalProducts,
        limit: itemsPerPage,
        offset,
        totalPages,
        currentPage
      },
      products: paginatedProducts
    })

  } catch (error) {
    console.error("Error fetching products for category:", error)
    
    res.status(500).json({
      error: "Failed to fetch products",
      message: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

function applySorting(products: any[], sortBy: string): any[] {
  switch (sortBy) {
    case 'price_asc':
      return products.sort((a, b) => {
        const priceA = a.variants?.[0]?.calculated_price?.amount || 0
        const priceB = b.variants?.[0]?.calculated_price?.amount || 0
        return priceA - priceB
      })
    case 'price_desc':
      return products.sort((a, b) => {
        const priceA = a.variants?.[0]?.calculated_price?.amount || 0
        const priceB = b.variants?.[0]?.calculated_price?.amount || 0
        return priceB - priceA
      })
    case 'newest':
      return products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    case 'name_asc':
      return products.sort((a, b) => a.title.localeCompare(b.title))
    case 'name_desc':
      return products.sort((a, b) => b.title.localeCompare(a.title))
    case 'popularity':
    default:
      return products
  }
}