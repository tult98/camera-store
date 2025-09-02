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

export interface FacetsResponse {
  category_id: string;
  total_products: number;
  facets: FacetAggregation[];
  applied_filters: Record<string, any>;
}

export interface FacetsRequest {
  category_id: string;
  applied_filters?: Record<string, unknown>;
  include_counts?: boolean;
}

// Legacy types for backward compatibility
export interface Facet extends FacetAggregation {
  id: string; // Maps to facet_key
  label: string; // Maps to facet_label
  type: string; // Maps to display_type
  options: Array<{
    value: string;
    label: string;
    count: number;
  }>; // Maps to values
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface CategoryFacetsRequest extends FacetsRequest {}
export interface CategoryFacetsResponse extends FacetsResponse {}