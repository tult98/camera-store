import { Logger } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  getAllCategoryIds,
  resolveQueryInstance,
} from "../../../utils/category-hierarchy";
import {
  aggregateBooleanFacet,
  aggregatePriceFacet,
  aggregateRangeFacet,
  aggregateTermFacet,
} from "../aggregators";
import { SYSTEM_FACETS, getSystemFacetLabel } from "../constants/system-facets";
import { PRODUCT_ATTRIBUTES_MODULE } from "../index";
import type { AttributeDefinition } from "../models/attribute-template";
import type {
  FacetAggregation,
  FacetResponse,
  FacetsResponse,
} from "../types/facet.types";
import { ProductFilterService } from "./product-filter.service";

class FacetAggregationService {
  protected logger_: Logger | Console;
  private container_: any;
  private productFilterService_: ProductFilterService;

  constructor(container: any, _options?: any) {
    this.container_ = container;
    this.productFilterService_ = new ProductFilterService(container);
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
        `Error getting facets for category ${categoryId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      // Return system facets as fallback
      return this.getSystemFacets();
    }
  }

  private extractFacetsFromTemplates(templates: any[]): FacetResponse[] {
    const facetsMap = new Map<string, FacetResponse>();

    for (const template of templates) {
      if (
        !template.attribute_definitions ||
        !Array.isArray(template.attribute_definitions)
      ) {
        continue;
      }

      for (const attrDef of template.attribute_definitions as AttributeDefinition[]) {
        if (attrDef.facet_config?.is_facet) {
          const newFacet: FacetResponse = {
            key: attrDef.key,
            label: attrDef.label,
            type: attrDef.type,
            display_priority: attrDef.facet_config.display_priority,
            config: attrDef.facet_config,
          };

          const existingFacet = facetsMap.get(attrDef.key);
          if (existingFacet) {
            this.logger_.warn(
              `Duplicate facet key "${attrDef.key}" found in multiple templates. Using facet with highest priority (lowest display_priority value).`
            );
            if (newFacet.display_priority < existingFacet.display_priority) {
              facetsMap.set(attrDef.key, newFacet);
            }
          } else {
            facetsMap.set(attrDef.key, newFacet);
          }
        }
      }
    }

    return Array.from(facetsMap.values());
  }

  private getSystemFacets(): FacetResponse[] {
    return SYSTEM_FACETS.map((sf) => ({
      key: sf.key,
      label: getSystemFacetLabel(sf.key),
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

  async aggregateSystemFacets(
    categoryId: string,
    appliedFilters: Record<string, unknown> = {},
    container?: any,
    pricingContext?: { region_id: string; currency_code: string },
    baseProducts?: any[]
  ): Promise<FacetAggregation[]> {
    const activeContainer = container || this.container_;
    const aggregations: FacetAggregation[] = [];

    try {
      // Get base products if not provided
      const baseProd =
        baseProducts ||
        (await this.productFilterService_.getBaseProducts(
          categoryId,
          activeContainer,
          pricingContext
        ));

      if (baseProd.length === 0) {
        return [];
      }

      // Get filtered products for counts
      const filteredProducts =
        await this.productFilterService_.getFilteredProducts(
          categoryId,
          appliedFilters,
          activeContainer,
          pricingContext
        );

      // Aggregate price facet using dedicated aggregator
      const priceAggregation = await aggregatePriceFacet(
        baseProd,
        activeContainer,
        pricingContext,
        filteredProducts,
        this.logger_
      );
      if (priceAggregation) {
        aggregations.push(priceAggregation);
      }

      return aggregations;
    } catch (error) {
      this.logger_.error(
        `Error aggregating system facets for category ${categoryId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return [];
    }
  }

  async aggregateAttributeFacets(
    categoryId: string,
    appliedFilters: Record<string, unknown> = {},
    container?: any,
    pricingContext?: { region_id: string; currency_code: string },
    baseProducts?: any[]
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

      // Get base products if not provided
      const baseProd =
        baseProducts ||
        (await this.productFilterService_.getBaseProducts(
          categoryId,
          activeContainer,
          pricingContext
        ));

      // Get filtered products for counts
      const filteredProducts =
        await this.productFilterService_.getFilteredProducts(
          categoryId,
          appliedFilters,
          activeContainer,
          pricingContext
        );

      const baseProductIds = baseProd.map((p: { id: string }) => p.id);
      const filteredProductIds = filteredProducts.map(
        (p: { id: string }) => p.id
      );

      // Get ProductAttribute data for base products (for all values)
      const productAttributesService = activeContainer.resolve(
        PRODUCT_ATTRIBUTES_MODULE
      );
      const baseProductAttributes =
        await productAttributesService.listProductAttributes({
          product_id: baseProductIds,
        });

      // Get ProductAttribute data for filtered products (for counts)
      const filteredProductAttributes =
        await productAttributesService.listProductAttributes({
          product_id: filteredProductIds,
        });

      // Aggregate each facet using dedicated aggregators
      for (const facetConfig of attributeFacets) {
        const aggregation = this.aggregateAttributeFacet(
          facetConfig,
          baseProductAttributes,
          filteredProductAttributes,
          appliedFilters
        );
        if (aggregation) {
          aggregations.push(aggregation);
        }
      }

      return aggregations;
    } catch (error) {
      this.logger_.error(
        `Error aggregating attribute facets for category ${categoryId}: ${
          error instanceof Error ? error.message : String(error)
        }`
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
      // Get base products for total count and facet values
      const baseProducts = await this.productFilterService_.getBaseProducts(
        categoryId,
        activeContainer,
        pricingContext
      );
      const totalProducts = baseProducts.length;

      logger.debug(
        `Found ${totalProducts} total products in category ${categoryId}`
      );

      // Get both system and attribute facets
      const [systemFacets, attributeFacets] = await Promise.all([
        this.aggregateSystemFacets(
          categoryId,
          appliedFilters,
          activeContainer,
          pricingContext,
          baseProducts
        ),
        this.aggregateAttributeFacets(
          categoryId,
          appliedFilters,
          activeContainer,
          pricingContext,
          baseProducts
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
        `Error aggregating facets for category ${categoryId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );

      return {
        category_id: categoryId,
        total_products: 0,
        facets: [],
        applied_filters: appliedFilters,
      };
    }
  }

  private aggregateAttributeFacet(
    facetConfig: FacetResponse,
    baseProductAttributes: any[],
    filteredProductAttributes: any[],
    _appliedFilters: Record<string, unknown>
  ): FacetAggregation | null {
    try {
      const { key, label, config } = facetConfig;

      // Filter base attributes for this facet key (for all possible values)
      const relevantBaseAttributes = baseProductAttributes.filter((pa: any) => {
        const attributeValues = pa.attribute_values || {};
        return (
          attributeValues[key] !== undefined && attributeValues[key] !== null
        );
      });

      // Filter filtered attributes for this facet key (for counts)
      const relevantFilteredAttributes = filteredProductAttributes.filter(
        (pa: any) => {
          const attributeValues = pa.attribute_values || {};
          return (
            attributeValues[key] !== undefined && attributeValues[key] !== null
          );
        }
      );

      if (relevantBaseAttributes.length === 0) {
        return null;
      }

      // Use dedicated aggregators based on aggregation type
      switch (config.aggregation_type) {
        case "term":
          return aggregateTermFacet(
            key,
            label,
            relevantBaseAttributes,
            relevantFilteredAttributes,
            config
          );
        case "range":
        case "histogram":
          return aggregateRangeFacet(
            key,
            label,
            relevantBaseAttributes,
            relevantFilteredAttributes,
            config
          );
        case "boolean":
          return aggregateBooleanFacet(
            key,
            label,
            relevantBaseAttributes,
            relevantFilteredAttributes,
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
        `Error aggregating facet ${facetConfig.key}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
  }
}

export default FacetAggregationService;
