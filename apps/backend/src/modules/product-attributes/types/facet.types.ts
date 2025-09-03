import type { FacetConfig } from "../models/attribute-template";

/**
 * Response structure for facet configuration data
 */
export interface FacetResponse {
  key: string;
  label: string;
  type: string;
  display_priority: number;
  config: FacetConfig;
}

/**
 * Aggregated facet data with values and counts for frontend display
 */
export interface FacetAggregation {
  facet_key: string;
  facet_label: string;
  aggregation_type: string;
  display_type: string;
  values: Array<{
    value: string | number | boolean;
    label: string;
    count: number;
    selected?: boolean;
  }>;
  range?: {
    min: number;
    max: number;
    step: number;
  };
  ui_config: {
    show_count: boolean;
    max_display_items?: number;
  };
}

/**
 * Complete facets response for a category with metadata
 */
export interface FacetsResponse {
  category_id: string;
  total_products: number;
  facets: FacetAggregation[];
  applied_filters: Record<string, any>;
}

/**
 * System-level facet configuration (price, availability, etc.)
 */
export interface SystemFacet {
  key: string;
  type: "price" | "availability" | "rating";
  aggregation_source: string;
  config: {
    display_priority: number;
    display_type: "slider" | "checkbox" | "range";
    show_count: boolean;
    aggregation_type: "range" | "term";
  };
}