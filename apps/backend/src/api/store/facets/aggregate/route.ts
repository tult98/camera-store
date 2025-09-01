import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_ATTRIBUTES_MODULE } from "../../../../modules/product-attributes"

interface AggregateRequest {
  category_id: string
  applied_filters?: Record<string, unknown>
  include_counts?: boolean
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const body = req.body as AggregateRequest
  const { category_id, applied_filters = {}, include_counts = true } = body

  // Input validation
  if (!category_id || typeof category_id !== 'string' || category_id.trim() === '') {
    return res.status(400).json({
      error: "Valid category ID is required"
    })
  }

  // Get region_id and currency_code from request headers for pricing context
  const region_id = req.headers["region_id"] as string;
  const currency_code = req.headers["currency_code"] as string;

  if (!region_id || !currency_code) {
    return res.status(400).json({
      error: "region_id and currency_code headers are required for pricing data"
    });
  }

  try {
    const productAttributesModuleService = req.scope.resolve(PRODUCT_ATTRIBUTES_MODULE)
    const facetAggregationService = productAttributesModuleService.getFacetAggregationService()

    // Get aggregated facet data with pricing context
    const aggregationResult = await facetAggregationService.aggregateFacets(
      category_id.trim(),
      applied_filters,
      include_counts,
      req.scope,
      { region_id, currency_code }
    )

    return res.json(aggregationResult)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Error aggregating facets for category:", errorMessage)
    
    return res.status(500).json({
      error: "Failed to aggregate facets"
    })
  }
}