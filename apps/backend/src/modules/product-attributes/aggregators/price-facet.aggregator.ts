import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";
import { Logger } from "@medusajs/framework/types";
import type { FacetAggregation } from "../types/facet.types";
import { calculatePriceStep } from "../utils/facet-calculators";

/**
 * Aggregates price facet from product variant pricing data
 * Determines price range across all product variants for slider display
 */
export async function aggregatePriceFacet(
  products: any[],
  container: any,
  pricingContext?: { region_id: string; currency_code: string },
  _filteredProducts?: any[],
  logger?: Logger | Console
): Promise<FacetAggregation | null> {
  try {
    if (products.length === 0) {
      return null;
    }

    // Use query.graph to get products with proper pricing context
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const productIds = products.map((p) => p.id);

    const result = await query.graph({
      entity: "product",
      fields: ["id", "variants.*", "variants.calculated_price.*"],
      filters: {
        id: productIds,
      },
      context: {
        variants: {
          calculated_price: QueryContext({
            region_id: pricingContext?.region_id,
            currency_code: pricingContext?.currency_code,
          }),
        },
      },
    });

    const productsWithPrices = result.data || [];

    // Extract all prices from variants
    const prices: number[] = [];

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
    const minPriceDollars = Math.floor(minPrice);
    const maxPriceDollars = Math.ceil(maxPrice);

    return {
      facet_key: "price",
      facet_label: "Price",
      aggregation_type: "range",
      display_type: "slider",
      values: [], // For range facets, values array can be empty
      range: {
        min: minPriceDollars,
        max: maxPriceDollars,
        step: calculatePriceStep(minPriceDollars, maxPriceDollars),
      },
      ui_config: {
        show_count: true,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (logger) {
      logger.error(`Error aggregating price facet: ${errorMessage}`);
    }
    return null;
  }
}
