"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateRangeFacet = aggregateRangeFacet;
const facet_calculators_1 = require("../utils/facet-calculators");
/**
 * Aggregates range-based facets (numeric values like weight, dimensions, etc.)
 * Determines min/max values from base products for slider ranges
 */
function aggregateRangeFacet(key, label, baseProductAttributes, _filteredProductAttributes, config) {
    // Use base products to determine the full range
    const numericValues = baseProductAttributes
        .map((pa) => Number(pa.attribute_values[key]))
        .filter((val) => !isNaN(val));
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
    const step = config.range_config?.step ?? (0, facet_calculators_1.calculateStep)(min, max);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtZmFjZXQuYWdncmVnYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtYXR0cmlidXRlcy9hZ2dyZWdhdG9ycy9yYW5nZS1mYWNldC5hZ2dyZWdhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsa0RBd0NDO0FBOUNELGtFQUEyRDtBQUUzRDs7O0dBR0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FDakMsR0FBVyxFQUNYLEtBQWEsRUFDYixxQkFBNEIsRUFDNUIsMEJBQWlDLEVBQ2pDLE1BQW1CO0lBRW5CLGdEQUFnRDtJQUNoRCxNQUFNLGFBQWEsR0FBRyxxQkFBcUI7U0FDeEMsR0FBRyxDQUFDLENBQUMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEQsTUFBTSxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRXhDLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMvQixPQUFPO1lBQ0wsU0FBUyxFQUFFLEdBQUc7WUFDZCxXQUFXLEVBQUUsS0FBSztZQUNsQixnQkFBZ0IsRUFBRSxPQUFPO1lBQ3pCLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtZQUNqQyxNQUFNLEVBQUUsRUFBRTtZQUNWLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO1lBQ3BDLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRTtTQUNyRCxDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsQ0FBQztJQUNuRSxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLENBQUM7SUFDbkUsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLElBQUksSUFBQSxpQ0FBYSxFQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVsRSxPQUFPO1FBQ0wsU0FBUyxFQUFFLEdBQUc7UUFDZCxXQUFXLEVBQUUsS0FBSztRQUNsQixnQkFBZ0IsRUFBRSxPQUFPO1FBQ3pCLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtRQUNqQyxNQUFNLEVBQUUsRUFBRSxFQUFFLHFFQUFxRTtRQUNqRixLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN6QixTQUFTLEVBQUU7WUFDVCxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJO1lBQ3JDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxpQkFBaUI7U0FDNUM7S0FDRixDQUFDO0FBQ0osQ0FBQyJ9