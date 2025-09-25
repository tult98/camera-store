import type { FacetConfig } from "../models/attribute-template";
import type { FacetAggregation } from "../types/facet.types";

/**
 * Aggregates term-based facets (categorical values like brand, color, etc.)
 * Uses dual-query approach: base products for all values, filtered products for counts
 */
export function aggregateTermFacet(
  key: string,
  label: string,
  baseProductAttributes: any[],
  filteredProductAttributes: any[],
  config: FacetConfig
): FacetAggregation {
  // Get all possible values from base attributes
  const allValues = new Set<string>();
  for (const pa of baseProductAttributes) {
    const value = pa.attribute_values[key];
    if (value) {
      allValues.add(String(value));
    }
  }

  // Count occurrences in filtered attributes
  const valueCounts = new Map<string, number>();
  for (const pa of filteredProductAttributes) {
    const value = pa.attribute_values[key];
    if (value) {
      const stringValue = String(value);
      valueCounts.set(stringValue, (valueCounts.get(stringValue) || 0) + 1);
    }
  }

  // Convert to response format, showing all values with their filtered counts
  const values = Array.from(allValues).map((value) => ({
    value,
    label: value,
    count: valueCounts.get(value) || 0,
  }));

  // Sort alphabetically by label for consistent ordering across API calls
  values.sort((a, b) => a.label.localeCompare(b.label));

  return {
    facet_key: key,
    facet_label: label,
    aggregation_type: "term",
    display_type: config.display_type,
    values,
    ui_config: {
      show_count: config.show_count || true,
      max_display_items: config.max_display_items,
    },
  };
}
