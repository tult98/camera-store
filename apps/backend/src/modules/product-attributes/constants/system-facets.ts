import type { SystemFacet } from "../types/facet.types";

/**
 * System-level facets that are available across all categories
 * These facets are derived from product data rather than attribute templates
 */
export const SYSTEM_FACETS: SystemFacet[] = [
  {
    key: "price",
    type: "price",
    aggregation_source: "variant.calculated_price",
    config: {
      display_priority: 0, // Always show first
      display_type: "slider",
      show_count: true,
      aggregation_type: "range",
    },
  },
];

/**
 * Get human-readable label for system facet keys
 */
export function getSystemFacetLabel(key: string): string {
  switch (key) {
    case "price":
      return "Price";
    case "availability":
      return "Availability";
    case "rating":
      return "Customer Rating";
    default:
      return key.charAt(0).toUpperCase() + key.slice(1);
  }
}