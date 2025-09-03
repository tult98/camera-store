import type { FacetConfig } from "../models/attribute-template";
import type { FacetAggregation } from "../types/facet.types";
import { calculateStep } from "../utils/facet-calculators";

/**
 * Aggregates range-based facets (numeric values like weight, dimensions, etc.)
 * Determines min/max values from base products for slider ranges
 */
export function aggregateRangeFacet(
  key: string,
  label: string,
  baseProductAttributes: any[],
  _filteredProductAttributes: any[],
  config: FacetConfig
): FacetAggregation {
  // Use base products to determine the full range
  const numericValues = baseProductAttributes
    .map((pa: any) => Number(pa.attribute_values[key]))
    .filter((val: number) => !isNaN(val));

  if (numericValues.length === 0) {
    return {
      facet_key: key,
      facet_label: label,
      aggregation_type: "range",
      display_type: config.display_type,
      values: [],
      range: { min: 0, max: 100, step: 1 },
      ui_config: { show_count: config.show_count || true },
    };
  }

  const min = config.range_config?.min ?? Math.min(...numericValues);
  const max = config.range_config?.max ?? Math.max(...numericValues);
  const step = config.range_config?.step ?? calculateStep(min, max);

  return {
    facet_key: key,
    facet_label: label,
    aggregation_type: "range",
    display_type: config.display_type,
    values: [], // Range facets typically use range object instead of discrete values
    range: { min, max, step },
    ui_config: {
      show_count: config.show_count || true,
      max_display_items: config.max_display_items,
    },
  };
}