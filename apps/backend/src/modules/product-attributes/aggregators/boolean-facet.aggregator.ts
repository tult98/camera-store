import type { FacetConfig } from "../models/attribute-template";
import type { FacetAggregation } from "../types/facet.types";

/**
 * Aggregates boolean-based facets (true/false values like "has wifi", "weather sealed", etc.)
 * Shows Yes/No options with counts from filtered products
 */
export function aggregateBooleanFacet(
  key: string,
  label: string,
  baseProductAttributes: any[],
  filteredProductAttributes: any[],
  config: FacetConfig
): FacetAggregation {
  // Check if any base products have true/false values to determine available options
  let hasTrue = false;
  let hasFalse = false;
  
  for (const pa of baseProductAttributes) {
    const value = pa.attribute_values[key];
    if (value === true || value === "true") {
      hasTrue = true;
    } else if (value === false || value === "false") {
      hasFalse = true;
    }
  }

  // Count occurrences in filtered products
  let trueCount = 0;
  let falseCount = 0;

  for (const pa of filteredProductAttributes) {
    const value = pa.attribute_values[key];
    if (value === true || value === "true") {
      trueCount++;
    } else if (value === false || value === "false") {
      falseCount++;
    }
  }

  // Always show both options in consistent order: Yes first, then No
  const values = [];
  if (hasTrue) {
    values.push({ value: true, label: "Yes", count: trueCount });
  }
  if (hasFalse) {
    values.push({ value: false, label: "No", count: falseCount });
  }

  return {
    facet_key: key,
    facet_label: label,
    aggregation_type: "boolean",
    display_type: config.display_type,
    values,
    ui_config: {
      show_count: config.show_count || true,
      max_display_items: config.max_display_items,
    },
  };
}