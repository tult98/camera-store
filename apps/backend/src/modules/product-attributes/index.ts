import ProductAttributesModuleService from "./service"

export const PRODUCT_ATTRIBUTES_MODULE = "productAttributes"

// Export types for external use
export type {
  FacetResponse,
  FacetAggregation,
  FacetsResponse,
  SystemFacet,
} from "./types/facet.types"

export default {
  service: ProductAttributesModuleService,
}