import { Module } from "@medusajs/framework/utils";
import ProductAttributesModuleService from "./service";

export const PRODUCT_ATTRIBUTES_MODULE = "productAttributes";

// Export types for external use
export type {
  FacetAggregation, FacetResponse, FacetsResponse,
  SystemFacet
} from "./types/facet.types";

export default Module(PRODUCT_ATTRIBUTES_MODULE, {
  service: ProductAttributesModuleService,
});
