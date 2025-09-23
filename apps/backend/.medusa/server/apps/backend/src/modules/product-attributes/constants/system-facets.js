"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_FACETS = void 0;
exports.getSystemFacetLabel = getSystemFacetLabel;
/**
 * System-level facets that are available across all categories
 * These facets are derived from product data rather than attribute templates
 */
exports.SYSTEM_FACETS = [
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
function getSystemFacetLabel(key) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtLWZhY2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtYXR0cmlidXRlcy9jb25zdGFudHMvc3lzdGVtLWZhY2V0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF1QkEsa0RBV0M7QUFoQ0Q7OztHQUdHO0FBQ1UsUUFBQSxhQUFhLEdBQWtCO0lBQzFDO1FBQ0UsR0FBRyxFQUFFLE9BQU87UUFDWixJQUFJLEVBQUUsT0FBTztRQUNiLGtCQUFrQixFQUFFLDBCQUEwQjtRQUM5QyxNQUFNLEVBQUU7WUFDTixnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsb0JBQW9CO1lBQ3pDLFlBQVksRUFBRSxRQUFRO1lBQ3RCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGdCQUFnQixFQUFFLE9BQU87U0FDMUI7S0FDRjtDQUNGLENBQUM7QUFFRjs7R0FFRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLEdBQVc7SUFDN0MsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNaLEtBQUssT0FBTztZQUNWLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLEtBQUssY0FBYztZQUNqQixPQUFPLGNBQWMsQ0FBQztRQUN4QixLQUFLLFFBQVE7WUFDWCxPQUFPLGlCQUFpQixDQUFDO1FBQzNCO1lBQ0UsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztBQUNILENBQUMifQ==