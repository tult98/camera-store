"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregatePriceFacet = aggregatePriceFacet;
const utils_1 = require("@medusajs/framework/utils");
const facet_calculators_1 = require("../utils/facet-calculators");
/**
 * Aggregates price facet from product variant pricing data
 * Determines price range across all product variants for slider display
 */
async function aggregatePriceFacet(products, container, pricingContext, _filteredProducts, logger) {
    try {
        if (products.length === 0) {
            return null;
        }
        // Use query.graph to get products with proper pricing context
        const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
        const productIds = products.map(p => p.id);
        const result = await query.graph({
            entity: "product",
            fields: [
                "id",
                "variants.*",
                "variants.calculated_price.*"
            ],
            filters: {
                id: productIds
            },
            context: {
                variants: {
                    calculated_price: (0, utils_1.QueryContext)({
                        region_id: pricingContext?.region_id,
                        currency_code: pricingContext?.currency_code,
                    }),
                },
            },
        });
        const productsWithPrices = result.data || [];
        // Extract all prices from variants
        const prices = [];
        for (const product of productsWithPrices) {
            if (product.variants) {
                for (const variant of product.variants) {
                    const price = variant.calculated_price?.calculated_amount || 0;
                    if (price > 0) {
                        prices.push(price);
                    }
                }
            }
        }
        if (prices.length === 0) {
            return null;
        }
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        // Convert from cents to dollars for display
        const minPriceDollars = Math.floor(minPrice / 100);
        const maxPriceDollars = Math.ceil(maxPrice / 100);
        return {
            facet_key: "price",
            facet_label: "Price",
            aggregation_type: "range",
            display_type: "slider",
            values: [], // For range facets, values array can be empty
            range: {
                min: minPriceDollars,
                max: maxPriceDollars,
                step: (0, facet_calculators_1.calculatePriceStep)(minPriceDollars, maxPriceDollars),
            },
            ui_config: {
                show_count: true,
            },
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (logger) {
            logger.error(`Error aggregating price facet: ${errorMessage}`);
        }
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtZmFjZXQuYWdncmVnYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtYXR0cmlidXRlcy9hZ2dyZWdhdG9ycy9wcmljZS1mYWNldC5hZ2dyZWdhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0Esa0RBcUZDO0FBOUZELHFEQUFvRjtBQUdwRixrRUFBZ0U7QUFFaEU7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLG1CQUFtQixDQUN2QyxRQUFlLEVBQ2YsU0FBYyxFQUNkLGNBQTZELEVBQzdELGlCQUF5QixFQUN6QixNQUF5QjtJQUV6QixJQUFJLENBQUM7UUFDSCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDMUIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsOERBQThEO1FBQzlELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUzQyxNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDL0IsTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFO2dCQUNOLElBQUk7Z0JBQ0osWUFBWTtnQkFDWiw2QkFBNkI7YUFDOUI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsRUFBRSxFQUFFLFVBQVU7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUU7b0JBQ1IsZ0JBQWdCLEVBQUUsSUFBQSxvQkFBWSxFQUFDO3dCQUM3QixTQUFTLEVBQUUsY0FBYyxFQUFFLFNBQVM7d0JBQ3BDLGFBQWEsRUFBRSxjQUFjLEVBQUUsYUFBYTtxQkFDN0MsQ0FBQztpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUU3QyxtQ0FBbUM7UUFDbkMsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBRTVCLEtBQUssTUFBTSxPQUFPLElBQUksa0JBQWtCLEVBQUUsQ0FBQztZQUN6QyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDckIsS0FBSyxNQUFNLE9BQU8sSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3ZDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsSUFBSSxDQUFDLENBQUM7b0JBQy9ELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO3dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3JCLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3hCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFFckMsNENBQTRDO1FBQzVDLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRWxELE9BQU87WUFDTCxTQUFTLEVBQUUsT0FBTztZQUNsQixXQUFXLEVBQUUsT0FBTztZQUNwQixnQkFBZ0IsRUFBRSxPQUFPO1lBQ3pCLFlBQVksRUFBRSxRQUFRO1lBQ3RCLE1BQU0sRUFBRSxFQUFFLEVBQUUsOENBQThDO1lBQzFELEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsZUFBZTtnQkFDcEIsR0FBRyxFQUFFLGVBQWU7Z0JBQ3BCLElBQUksRUFBRSxJQUFBLHNDQUFrQixFQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7YUFDM0Q7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsVUFBVSxFQUFFLElBQUk7YUFDakI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLFlBQVksR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUUsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztBQUNILENBQUMifQ==