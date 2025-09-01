import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../../modules/product-attributes"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { category_id } = req.params

  // Input validation
  if (!category_id || typeof category_id !== 'string' || category_id.trim() === '') {
    return res.status(400).json({
      error: "Valid category ID is required"
    })
  }

  try {
    const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
    const facetAggregationService = productAttributesModuleService.getFacetAggregationService()

    const facets = await facetAggregationService.getFacetsForCategory(category_id.trim(), req.scope)

    return res.json({
      category_id,
      facets
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error fetching facets for category:", errorMessage)
    
    return res.status(500).json({
      error: "Failed to fetch facets"
    })
  }
}