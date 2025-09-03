import { Modules, ContainerRegistrationKeys, QueryContext } from "@medusajs/framework/utils";
import { Logger } from "@medusajs/framework/types";
import { getAllCategoryIds } from "../../../utils/category-hierarchy";
import { PRODUCT_ATTRIBUTES_MODULE } from "../index";

const DEFAULT_REGION_ID = "reg_01J9K0FDQZ8X3N8Q9NBXD5EKPK";
const DEFAULT_CURRENCY_CODE = "usd";

export class ProductFilterService {
  protected logger_: Logger | Console;
  private container_: any;

  constructor(container: any, _options?: any) {
    this.container_ = container;
    // Try to resolve logger, fallback to console if not available
    try {
      this.logger_ = container.resolve
        ? container.resolve(ContainerRegistrationKeys.LOGGER)
        : container[ContainerRegistrationKeys.LOGGER] || console;
    } catch {
      this.logger_ = console;
    }
  }

  /**
   * Get all products in a category and its child categories with pricing data
   */
  async getBaseProducts(
    categoryId: string,
    container: any,
    pricingContext?: { region_id: string; currency_code: string }
  ) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    // Get all category IDs including child categories
    const categoryIds = await getAllCategoryIds(query, categoryId);

    // Get all products in category and child categories with pricing data
    const result = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "variants.calculated_price.*"
      ],
      filters: {
        categories: { id: categoryIds },
        status: "published"
      },
      context: {
        variants: {
          calculated_price: QueryContext({
            region_id: pricingContext?.region_id || DEFAULT_REGION_ID,
            currency_code: pricingContext?.currency_code || DEFAULT_CURRENCY_CODE,
          }),
        },
      },
    });

    return result.data || [];
  }

  /**
   * Filter products based on applied filters (price and attribute filters)
   */
  async getFilteredProducts(
    categoryId: string,
    appliedFilters: Record<string, unknown>,
    container: any,
    pricingContext?: { region_id: string; currency_code: string }
  ) {
    const productAttributesService = container.resolve(
      PRODUCT_ATTRIBUTES_MODULE
    );

    // Get base products first
    let products = await this.getBaseProducts(categoryId, container, pricingContext);

    // If no filters applied, return all products
    if (Object.keys(appliedFilters).length === 0) {
      return products;
    }

    // Handle price filter (system facet) in memory
    const priceFilter = appliedFilters["price"] as
      | { min?: number; max?: number }
      | undefined;
    if (priceFilter) {
      products = this.filterByPrice(products, priceFilter);
    }

    // Handle attribute filters
    const attributeFilters = Object.entries(appliedFilters).filter(
      ([key]) => key !== "price"
    );

    if (attributeFilters.length === 0) {
      return products;
    }

    return await this.filterByAttributes(products, attributeFilters, productAttributesService);
  }

  /**
   * Filter products by price range
   */
  private filterByPrice(
    products: any[],
    priceFilter: { min?: number; max?: number }
  ): any[] {
    return products.filter((product: any) => {
      // Check if any variant matches the price filter
      return product.variants?.some((variant: any) => {
        const price = variant.calculated_price?.calculated_amount || 0;
        
        if (price === 0) return false;
        
        if (priceFilter.min !== undefined && price < priceFilter.min * 100) {
          return false;
        }
        if (priceFilter.max !== undefined && price > priceFilter.max * 100) {
          return false;
        }
        return true;
      });
    });
  }

  /**
   * Filter products by attribute values using intersection logic (ALL filters must match)
   */
  private async filterByAttributes(
    products: any[],
    attributeFilters: Array<[string, unknown]>,
    productAttributesService: any
  ): Promise<any[]> {
    const productIds = products.map((p: { id: string }) => p.id);

    // Get product attributes for filtering
    const productAttributes =
      await productAttributesService.listProductAttributes({
        product_id: productIds,
      });

    // Filter products based on attribute filters
    const filteredProductIds = new Set<string>();

    for (const pa of productAttributes) {
      const attributeValues = pa.attribute_values || {};
      let matchesAllFilters = true;

      // Check if product matches ALL applied attribute filters
      for (const [filterKey, filterValue] of attributeFilters) {
        const productValue = attributeValues[filterKey];

        // Handle array filters (e.g., brand: ["Canon", "Sony"])
        if (Array.isArray(filterValue)) {
          if (!filterValue.includes(productValue)) {
            matchesAllFilters = false;
            break;
          }
        }
        // Handle single value filters
        else if (productValue !== filterValue) {
          matchesAllFilters = false;
          break;
        }
      }

      if (matchesAllFilters) {
        filteredProductIds.add(pa.product_id);
      }
    }

    // Return only products that match all filters
    return products.filter((p: { id: string }) => filteredProductIds.has(p.id));
  }
}