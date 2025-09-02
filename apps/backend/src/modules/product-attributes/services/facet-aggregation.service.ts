import { Modules, ContainerRegistrationKeys, QueryContext } from "@medusajs/framework/utils";
import { Logger } from "@medusajs/framework/types";
import type {
  AttributeDefinition,
  FacetConfig,
} from "../models/attribute-template";
import { PRODUCT_ATTRIBUTES_MODULE } from "../index";
import { getAllCategoryIds, resolveQueryInstance } from "../../../utils/category-hierarchy";

interface FacetResponse {
  key: string;
  label: string;
  type: string;
  display_priority: number;
  config: FacetConfig;
}

interface FacetAggregation {
  facet_key: string;
  facet_label: string;
  aggregation_type: string;
  display_type: string;
  values: Array<{
    value: string | number | boolean;
    label: string;
    count: number;
    selected?: boolean;
  }>;
  range?: {
    min: number;
    max: number;
    step: number;
  };
  ui_config: {
    show_count: boolean;
    max_display_items?: number;
  };
}

interface FacetsResponse {
  category_id: string;
  total_products: number;
  facets: FacetAggregation[];
  applied_filters: Record<string, any>;
}

interface SystemFacet {
  key: string;
  type: "price" | "availability" | "rating";
  aggregation_source: string;
  config: {
    display_priority: number;
    display_type: "slider" | "checkbox" | "range";
    show_count: boolean;
    aggregation_type: "range" | "term";
  };
}

const SYSTEM_FACETS: SystemFacet[] = [
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

class FacetAggregationService {
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

  async getFacetsForCategory(
    categoryId: string,
    container?: any
  ): Promise<FacetResponse[]> {
    const activeContainer = container || this.container_;
    try {
      // Get all category IDs including child categories
      const query = resolveQueryInstance(activeContainer);
      const categoryIds = await getAllCategoryIds(query, categoryId);
      
      // Get all products in the category and child categories using container resolve
      const productModule = activeContainer.resolve(Modules.PRODUCT);
      const products = await productModule.listProducts({
        categories: { id: categoryIds },
      });

      if (!products || products.length === 0) {
        this.logger_.debug(`No products found for category ${categoryId}`);
        return this.getSystemFacets();
      }

      const productIds = products.map((p: { id: string }) => p.id);

      // Get all ProductAttribute records for these products through the module service
      const productAttributesService = activeContainer.resolve(
        PRODUCT_ATTRIBUTES_MODULE
      );
      const productAttributes =
        await productAttributesService.listProductAttributes({
          product_id: productIds,
        });

      if (!productAttributes || productAttributes.length === 0) {
        this.logger_.debug(
          `No product attributes found for products in category ${categoryId}`
        );
        return this.getSystemFacets();
      }

      // Get unique template IDs
      const templateIds = [
        ...new Set(productAttributes.map((pa: any) => pa.template_id)),
      ];

      // Get all AttributeTemplates through the module service
      const templates = await productAttributesService.listAttributeTemplates({
        id: templateIds,
        is_active: true,
      });

      // Extract facet-enabled attributes from all templates
      const attributeFacets = this.extractFacetsFromTemplates(templates);

      // Combine with system facets
      const systemFacets = this.getSystemFacets();

      // Merge and sort by display_priority
      const allFacets = [...systemFacets, ...attributeFacets];
      return allFacets.sort((a, b) => a.display_priority - b.display_priority);
    } catch (error) {
      this.logger_.error(
        `Error getting facets for category ${categoryId}:`,
        error as Error
      );
      // Return system facets as fallback
      return this.getSystemFacets();
    }
  }

  private extractFacetsFromTemplates(templates: any[]): FacetResponse[] {
    const facets: FacetResponse[] = [];

    for (const template of templates) {
      if (
        !template.attribute_definitions ||
        !Array.isArray(template.attribute_definitions)
      ) {
        continue;
      }

      for (const attrDef of template.attribute_definitions as AttributeDefinition[]) {
        // Check if this attribute is configured as a facet
        if (attrDef.facet_config?.is_facet) {
          facets.push({
            key: attrDef.key,
            label: attrDef.label,
            type: attrDef.type,
            display_priority: attrDef.facet_config.display_priority,
            config: attrDef.facet_config,
          });
        }
      }
    }

    return facets;
  }

  private getSystemFacets(): FacetResponse[] {
    return SYSTEM_FACETS.map((sf) => ({
      key: sf.key,
      label: this.getSystemFacetLabel(sf.key),
      type: sf.type,
      display_priority: sf.config.display_priority,
      config: {
        is_facet: true,
        display_priority: sf.config.display_priority,
        aggregation_type: sf.config.aggregation_type,
        display_type: "slider" as const,
        show_count: sf.config.show_count,
      },
    }));
  }

  private getSystemFacetLabel(key: string): string {
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

  async aggregateSystemFacets(
    categoryId: string,
    appliedFilters: Record<string, unknown> = {},
    container?: any,
    pricingContext?: { region_id: string; currency_code: string }
  ): Promise<FacetAggregation[]> {
    const activeContainer = container || this.container_;
    const aggregations: FacetAggregation[] = [];

    try {
      // Get products in category with applied filters
      const products = await this.getFilteredProducts(
        categoryId,
        appliedFilters,
        activeContainer,
        pricingContext
      );

      if (products.length === 0) {
        return [];
      }

      // Aggregate price facet from variants
      const priceAggregation = await this.aggregatePriceFacet(
        products,
        activeContainer,
        pricingContext
      );
      if (priceAggregation) {
        aggregations.push(priceAggregation);
      }

      return aggregations;
    } catch (error) {
      this.logger_.error(
        `Error aggregating system facets for category ${categoryId}:`,
        error instanceof Error ? error : new Error(String(error))
      );
      return [];
    }
  }

  async aggregateAttributeFacets(
    categoryId: string,
    appliedFilters: Record<string, unknown> = {},
    container?: any,
    pricingContext?: { region_id: string; currency_code: string }
  ): Promise<FacetAggregation[]> {
    const activeContainer = container || this.container_;
    const aggregations: FacetAggregation[] = [];

    try {
      // Get facet configurations for category
      const facetConfigs = await this.getFacetsForCategory(
        categoryId,
        activeContainer
      );
      const attributeFacets = facetConfigs.filter((f) => f.key !== "price"); // Exclude system facets

      if (attributeFacets.length === 0) {
        return [];
      }

      // Get products in category with applied filters
      const products = await this.getFilteredProducts(
        categoryId,
        appliedFilters,
        activeContainer,
        pricingContext
      );
      const productIds = products.map((p: { id: string }) => p.id);

      // Get ProductAttribute data for these products
      const productAttributesService = activeContainer.resolve(
        PRODUCT_ATTRIBUTES_MODULE
      );
      const productAttributes =
        await productAttributesService.listProductAttributes({
          product_id: productIds,
        });

      // Aggregate each facet
      for (const facetConfig of attributeFacets) {
        const aggregation = await this.aggregateAttributeFacet(
          facetConfig,
          productAttributes,
          appliedFilters
        );
        if (aggregation) {
          aggregations.push(aggregation);
        }
      }

      return aggregations;
    } catch (error) {
      this.logger_.error(
        `Error aggregating attribute facets for category ${categoryId}:`,
        error instanceof Error ? error : new Error(String(error))
      );
      return [];
    }
  }

  async aggregateFacets(
    categoryId: string,
    appliedFilters: Record<string, unknown> = {},
    _includeCounts = true,
    container?: any,
    pricingContext?: { region_id: string; currency_code: string }
  ): Promise<FacetsResponse> {
    const activeContainer = container || this.container_;

    // Safely resolve logger from the active container
    let logger: Logger | Console = this.logger_;
    try {
      if (activeContainer.resolve) {
        logger = activeContainer.resolve(
          ContainerRegistrationKeys.LOGGER
        ) as Logger;
      }
    } catch {
      // Use existing logger if resolution fails
    }

    logger.debug(
      `Starting facet aggregation for category ${categoryId} with filters: ${JSON.stringify(
        appliedFilters
      )}`
    );

    try {
      // Get total product count for category
      const allProducts = await this.getFilteredProducts(
        categoryId,
        {},
        activeContainer,
        pricingContext
      );
      const totalProducts = allProducts.length;

      logger.debug(
        `Found ${totalProducts} total products in category ${categoryId}`
      );

      // Get both system and attribute facets
      const [systemFacets, attributeFacets] = await Promise.all([
        this.aggregateSystemFacets(categoryId, appliedFilters, activeContainer, pricingContext),
        this.aggregateAttributeFacets(
          categoryId,
          appliedFilters,
          activeContainer,
          pricingContext
        ),
      ]);

      logger.debug(
        `Aggregated ${systemFacets.length} system facets and ${attributeFacets.length} attribute facets`
      );

      const allFacets = [...systemFacets, ...attributeFacets];

      // Sort by display priority
      allFacets.sort((a, b) => {
        const aPriority =
          a.facet_key === "price" ? 0 : (a as any).display_priority || 999;
        const bPriority =
          b.facet_key === "price" ? 0 : (b as any).display_priority || 999;
        return aPriority - bPriority;
      });

      const response = {
        category_id: categoryId,
        total_products: totalProducts,
        facets: allFacets,
        applied_filters: appliedFilters,
      };

      logger.info(
        `Successfully aggregated ${allFacets.length} facets for category ${categoryId}`
      );

      return response;
    } catch (error) {
      logger.error(
        `Error aggregating facets for category ${categoryId}:`,
        error instanceof Error ? error : new Error(String(error))
      );

      return {
        category_id: categoryId,
        total_products: 0,
        facets: [],
        applied_filters: appliedFilters,
      };
    }
  }

  private async getFilteredProducts(
    categoryId: string,
    appliedFilters: Record<string, unknown>,
    container: any,
    pricingContext?: { region_id: string; currency_code: string }
  ) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const productAttributesService = container.resolve(
      PRODUCT_ATTRIBUTES_MODULE
    );

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
            region_id: pricingContext?.region_id || "reg_01J9K0FDQZ8X3N8Q9NBXD5EKPK",
            currency_code: pricingContext?.currency_code || "usd",
          }),
        },
      },
    });

    let products = result.data || [];

    // If no filters applied, return all products
    if (Object.keys(appliedFilters).length === 0) {
      return products;
    }

    // Handle price filter (system facet) in memory
    const priceFilter = appliedFilters["price"] as
      | { min?: number; max?: number }
      | undefined;
    if (priceFilter) {
      products = products.filter((product: any) => {
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

    // Handle attribute filters
    const attributeFilters = Object.entries(appliedFilters).filter(
      ([key]) => key !== "price"
    );

    if (attributeFilters.length === 0) {
      return products;
    }

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

  private async aggregatePriceFacet(
    products: any[],
    container: any,
    pricingContext?: { region_id: string; currency_code: string }
  ): Promise<FacetAggregation | null> {
    try {
      if (products.length === 0) {
        return null;
      }

      // Use query.graph to get products with proper pricing context
      const query = container.resolve(ContainerRegistrationKeys.QUERY);
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
            calculated_price: QueryContext({
              region_id: pricingContext?.region_id || "reg_01J9K0FDQZ8X3N8Q9NBXD5EKPK",
              currency_code: pricingContext?.currency_code || "usd",
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

      return {
        facet_key: "price",
        facet_label: "Price",
        aggregation_type: "range",
        display_type: "slider",
        values: [], // For range facets, values array can be empty
        range: {
          min: minPrice,
          max: maxPrice,
          step: this.calculatePriceStep(minPrice, maxPrice),
        },
        ui_config: {
          show_count: true,
        },
      };
    } catch (error) {
      this.logger_.error(
        "Error aggregating price facet:",
        error instanceof Error ? error : new Error(String(error))
      );
      return null;
    }
  }

  private calculatePriceStep(min: number, max: number): number {
    const range = max - min;
    if (range <= 100) return 5;
    if (range <= 500) return 10;
    if (range <= 1000) return 25;
    if (range <= 5000) return 50;
    return 100;
  }

  private async aggregateAttributeFacet(
    facetConfig: FacetResponse,
    productAttributes: any[],
    _appliedFilters: Record<string, unknown>
  ): Promise<FacetAggregation | null> {
    try {
      const { key, label, config } = facetConfig;

      // Filter attributes for this facet key
      const relevantAttributes = productAttributes.filter((pa: any) => {
        const attributeValues = pa.attribute_values || {};
        return (
          attributeValues[key] !== undefined && attributeValues[key] !== null
        );
      });

      if (relevantAttributes.length === 0) {
        return null;
      }

      // Aggregate based on aggregation type
      switch (config.aggregation_type) {
        case "term":
          return this.aggregateTermFacet(
            key,
            label,
            relevantAttributes,
            config
          );
        case "range":
        case "histogram":
          return this.aggregateRangeFacet(
            key,
            label,
            relevantAttributes,
            config
          );
        case "boolean":
          return this.aggregateBooleanFacet(
            key,
            label,
            relevantAttributes,
            config
          );
        default:
          this.logger_.warn(
            `Unknown aggregation type: ${config.aggregation_type}`
          );
          return null;
      }
    } catch (error) {
      this.logger_.error(
        `Error aggregating facet ${facetConfig.key}:`,
        error instanceof Error ? error : new Error(String(error))
      );
      return null;
    }
  }

  private aggregateTermFacet(
    key: string,
    label: string,
    productAttributes: any[],
    config: FacetConfig
  ): FacetAggregation {
    const valueCounts = new Map<string, number>();

    // Count occurrences of each value
    for (const pa of productAttributes) {
      const value = pa.attribute_values[key];
      if (value) {
        const stringValue = String(value);
        valueCounts.set(stringValue, (valueCounts.get(stringValue) || 0) + 1);
      }
    }

    // Convert to response format
    const values = Array.from(valueCounts.entries()).map(([value, count]) => ({
      value,
      label: value,
      count,
    }));

    // Sort by count (descending) then by label
    values.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

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

  private aggregateRangeFacet(
    key: string,
    label: string,
    productAttributes: any[],
    config: FacetConfig
  ): FacetAggregation {
    const numericValues = productAttributes
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
    const step = config.range_config?.step ?? this.calculateStep(min, max);

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

  private aggregateBooleanFacet(
    key: string,
    label: string,
    productAttributes: any[],
    config: FacetConfig
  ): FacetAggregation {
    let trueCount = 0;
    let falseCount = 0;

    for (const pa of productAttributes) {
      const value = pa.attribute_values[key];
      if (value === true || value === "true") {
        trueCount++;
      } else if (value === false || value === "false") {
        falseCount++;
      }
    }

    const values = [];
    if (trueCount > 0) {
      values.push({ value: true, label: "Yes", count: trueCount });
    }
    if (falseCount > 0) {
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

  private calculateStep(min: number, max: number): number {
    const range = max - min;
    if (range <= 10) return 1;
    if (range <= 100) return 5;
    if (range <= 1000) return 10;
    return 50;
  }
}

export default FacetAggregationService;
