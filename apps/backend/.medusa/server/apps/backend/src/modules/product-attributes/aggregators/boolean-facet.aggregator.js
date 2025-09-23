"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateBooleanFacet = aggregateBooleanFacet;
/**
 * Aggregates boolean-based facets (true/false values like "has wifi", "weather sealed", etc.)
 * Shows Yes/No options with counts from filtered products
 */
function aggregateBooleanFacet(key, label, baseProductAttributes, filteredProductAttributes, config) {
    // Check if any base products have true/false values to determine available options
    let hasTrue = false;
    let hasFalse = false;
    for (const pa of baseProductAttributes) {
        const value = pa.attribute_values[key];
        if (value === true || value === "true") {
            hasTrue = true;
        }
        else if (value === false || value === "false") {
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
        }
        else if (value === false || value === "false") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vbGVhbi1mYWNldC5hZ2dyZWdhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvcHJvZHVjdC1hdHRyaWJ1dGVzL2FnZ3JlZ2F0b3JzL2Jvb2xlYW4tZmFjZXQuYWdncmVnYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BLHNEQXFEQztBQXpERDs7O0dBR0c7QUFDSCxTQUFnQixxQkFBcUIsQ0FDbkMsR0FBVyxFQUNYLEtBQWEsRUFDYixxQkFBNEIsRUFDNUIseUJBQWdDLEVBQ2hDLE1BQW1CO0lBRW5CLG1GQUFtRjtJQUNuRixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDcEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBRXJCLEtBQUssTUFBTSxFQUFFLElBQUkscUJBQXFCLEVBQUUsQ0FBQztRQUN2QyxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUN2QyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLENBQUM7YUFBTSxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRSxDQUFDO1lBQ2hELFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDbEIsQ0FBQztJQUNILENBQUM7SUFFRCx5Q0FBeUM7SUFDekMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUVuQixLQUFLLE1BQU0sRUFBRSxJQUFJLHlCQUF5QixFQUFFLENBQUM7UUFDM0MsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDdkMsU0FBUyxFQUFFLENBQUM7UUFDZCxDQUFDO2FBQU0sSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUNoRCxVQUFVLEVBQUUsQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNsQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBQ0QsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELE9BQU87UUFDTCxTQUFTLEVBQUUsR0FBRztRQUNkLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLGdCQUFnQixFQUFFLFNBQVM7UUFDM0IsWUFBWSxFQUFFLE1BQU0sQ0FBQyxZQUFZO1FBQ2pDLE1BQU07UUFDTixTQUFTLEVBQUU7WUFDVCxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJO1lBQ3JDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxpQkFBaUI7U0FDNUM7S0FDRixDQUFDO0FBQ0osQ0FBQyJ9