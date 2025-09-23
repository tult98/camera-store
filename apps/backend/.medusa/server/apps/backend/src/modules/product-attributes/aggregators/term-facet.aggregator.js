"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateTermFacet = aggregateTermFacet;
/**
 * Aggregates term-based facets (categorical values like brand, color, etc.)
 * Uses dual-query approach: base products for all values, filtered products for counts
 */
function aggregateTermFacet(key, label, baseProductAttributes, filteredProductAttributes, config) {
    // Get all possible values from base attributes
    const allValues = new Set();
    for (const pa of baseProductAttributes) {
        const value = pa.attribute_values[key];
        if (value) {
            allValues.add(String(value));
        }
    }
    // Count occurrences in filtered attributes
    const valueCounts = new Map();
    for (const pa of filteredProductAttributes) {
        const value = pa.attribute_values[key];
        if (value) {
            const stringValue = String(value);
            valueCounts.set(stringValue, (valueCounts.get(stringValue) || 0) + 1);
        }
    }
    // Convert to response format, showing all values with their filtered counts
    const values = Array.from(allValues).map(value => ({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybS1mYWNldC5hZ2dyZWdhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcHJvZHVjdC1hdHRyaWJ1dGVzL2FnZ3JlZ2F0b3JzL3Rlcm0tZmFjZXQuYWdncmVnYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BLGdEQStDQztBQW5ERDs7O0dBR0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FDaEMsR0FBVyxFQUNYLEtBQWEsRUFDYixxQkFBNEIsRUFDNUIseUJBQWdDLEVBQ2hDLE1BQW1CO0lBRW5CLCtDQUErQztJQUMvQyxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0lBQ3BDLEtBQUssTUFBTSxFQUFFLElBQUkscUJBQXFCLEVBQUUsQ0FBQztRQUN2QyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNWLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFDOUMsS0FBSyxNQUFNLEVBQUUsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBQzNDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1YsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLFdBQVcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4RSxDQUFDO0lBQ0gsQ0FBQztJQUVELDRFQUE0RTtJQUM1RSxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakQsS0FBSztRQUNMLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztLQUNuQyxDQUFDLENBQUMsQ0FBQztJQUVKLHdFQUF3RTtJQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFdEQsT0FBTztRQUNMLFNBQVMsRUFBRSxHQUFHO1FBQ2QsV0FBVyxFQUFFLEtBQUs7UUFDbEIsZ0JBQWdCLEVBQUUsTUFBTTtRQUN4QixZQUFZLEVBQUUsTUFBTSxDQUFDLFlBQVk7UUFDakMsTUFBTTtRQUNOLFNBQVMsRUFBRTtZQUNULFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUk7WUFDckMsaUJBQWlCLEVBQUUsTUFBTSxDQUFDLGlCQUFpQjtTQUM1QztLQUNGLENBQUM7QUFDSixDQUFDIn0=