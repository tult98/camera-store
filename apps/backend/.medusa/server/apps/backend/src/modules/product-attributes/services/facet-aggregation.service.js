"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const category_hierarchy_1 = require("../../../utils/category-hierarchy");
const aggregators_1 = require("../aggregators");
const system_facets_1 = require("../constants/system-facets");
const index_1 = require("../index");
const product_filter_service_1 = require("./product-filter.service");
class FacetAggregationService {
    constructor(container, _options) {
        this.container_ = container;
        this.productFilterService_ = new product_filter_service_1.ProductFilterService(container);
        // Try to resolve logger, fallback to console if not available
        try {
            this.logger_ = container.resolve
                ? container.resolve(utils_1.ContainerRegistrationKeys.LOGGER)
                : container[utils_1.ContainerRegistrationKeys.LOGGER] || console;
        }
        catch {
            this.logger_ = console;
        }
    }
    async getFacetsForCategory(categoryId, container) {
        const activeContainer = container || this.container_;
        try {
            // Get all category IDs including child categories
            const query = (0, category_hierarchy_1.resolveQueryInstance)(activeContainer);
            const categoryIds = await (0, category_hierarchy_1.getAllCategoryIds)(query, categoryId);
            // Get all products in the category and child categories using container resolve
            const productModule = activeContainer.resolve(utils_1.Modules.PRODUCT);
            const products = await productModule.listProducts({
                categories: { id: categoryIds },
            });
            if (!products || products.length === 0) {
                this.logger_.debug(`No products found for category ${categoryId}`);
                return this.getSystemFacets();
            }
            const productIds = products.map((p) => p.id);
            // Get all ProductAttribute records for these products through the module service
            const productAttributesService = activeContainer.resolve(index_1.PRODUCT_ATTRIBUTES_MODULE);
            const productAttributes = await productAttributesService.listProductAttributes({
                product_id: productIds,
            });
            if (!productAttributes || productAttributes.length === 0) {
                this.logger_.debug(`No product attributes found for products in category ${categoryId}`);
                return this.getSystemFacets();
            }
            // Get unique template IDs
            const templateIds = [
                ...new Set(productAttributes.map((pa) => pa.template_id)),
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
        }
        catch (error) {
            this.logger_.error(`Error getting facets for category ${categoryId}: ${error instanceof Error ? error.message : String(error)}`);
            // Return system facets as fallback
            return this.getSystemFacets();
        }
    }
    extractFacetsFromTemplates(templates) {
        const facets = [];
        for (const template of templates) {
            if (!template.attribute_definitions ||
                !Array.isArray(template.attribute_definitions)) {
                continue;
            }
            for (const attrDef of template.attribute_definitions) {
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
    getSystemFacets() {
        return system_facets_1.SYSTEM_FACETS.map((sf) => ({
            key: sf.key,
            label: (0, system_facets_1.getSystemFacetLabel)(sf.key),
            type: sf.type,
            display_priority: sf.config.display_priority,
            config: {
                is_facet: true,
                display_priority: sf.config.display_priority,
                aggregation_type: sf.config.aggregation_type,
                display_type: "slider",
                show_count: sf.config.show_count,
            },
        }));
    }
    async aggregateSystemFacets(categoryId, appliedFilters = {}, container, pricingContext, baseProducts) {
        const activeContainer = container || this.container_;
        const aggregations = [];
        try {
            // Get base products if not provided
            const baseProd = baseProducts ||
                (await this.productFilterService_.getBaseProducts(categoryId, activeContainer, pricingContext));
            if (baseProd.length === 0) {
                return [];
            }
            // Get filtered products for counts
            const filteredProducts = await this.productFilterService_.getFilteredProducts(categoryId, appliedFilters, activeContainer, pricingContext);
            // Aggregate price facet using dedicated aggregator
            const priceAggregation = await (0, aggregators_1.aggregatePriceFacet)(baseProd, activeContainer, pricingContext, filteredProducts, this.logger_);
            if (priceAggregation) {
                aggregations.push(priceAggregation);
            }
            return aggregations;
        }
        catch (error) {
            this.logger_.error(`Error aggregating system facets for category ${categoryId}: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }
    async aggregateAttributeFacets(categoryId, appliedFilters = {}, container, pricingContext, baseProducts) {
        const activeContainer = container || this.container_;
        const aggregations = [];
        try {
            // Get facet configurations for category
            const facetConfigs = await this.getFacetsForCategory(categoryId, activeContainer);
            const attributeFacets = facetConfigs.filter((f) => f.key !== "price"); // Exclude system facets
            if (attributeFacets.length === 0) {
                return [];
            }
            // Get base products if not provided
            const baseProd = baseProducts ||
                (await this.productFilterService_.getBaseProducts(categoryId, activeContainer, pricingContext));
            // Get filtered products for counts
            const filteredProducts = await this.productFilterService_.getFilteredProducts(categoryId, appliedFilters, activeContainer, pricingContext);
            const baseProductIds = baseProd.map((p) => p.id);
            const filteredProductIds = filteredProducts.map((p) => p.id);
            // Get ProductAttribute data for base products (for all values)
            const productAttributesService = activeContainer.resolve(index_1.PRODUCT_ATTRIBUTES_MODULE);
            const baseProductAttributes = await productAttributesService.listProductAttributes({
                product_id: baseProductIds,
            });
            // Get ProductAttribute data for filtered products (for counts)
            const filteredProductAttributes = await productAttributesService.listProductAttributes({
                product_id: filteredProductIds,
            });
            // Aggregate each facet using dedicated aggregators
            for (const facetConfig of attributeFacets) {
                const aggregation = this.aggregateAttributeFacet(facetConfig, baseProductAttributes, filteredProductAttributes, appliedFilters);
                if (aggregation) {
                    aggregations.push(aggregation);
                }
            }
            return aggregations;
        }
        catch (error) {
            this.logger_.error(`Error aggregating attribute facets for category ${categoryId}: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }
    async aggregateFacets(categoryId, appliedFilters = {}, _includeCounts = true, container, pricingContext) {
        const activeContainer = container || this.container_;
        // Safely resolve logger from the active container
        let logger = this.logger_;
        try {
            if (activeContainer.resolve) {
                logger = activeContainer.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
            }
        }
        catch {
            // Use existing logger if resolution fails
        }
        logger.debug(`Starting facet aggregation for category ${categoryId} with filters: ${JSON.stringify(appliedFilters)}`);
        try {
            // Get base products for total count and facet values
            const baseProducts = await this.productFilterService_.getBaseProducts(categoryId, activeContainer, pricingContext);
            const totalProducts = baseProducts.length;
            logger.debug(`Found ${totalProducts} total products in category ${categoryId}`);
            // Get both system and attribute facets
            const [systemFacets, attributeFacets] = await Promise.all([
                this.aggregateSystemFacets(categoryId, appliedFilters, activeContainer, pricingContext, baseProducts),
                this.aggregateAttributeFacets(categoryId, appliedFilters, activeContainer, pricingContext, baseProducts),
            ]);
            logger.debug(`Aggregated ${systemFacets.length} system facets and ${attributeFacets.length} attribute facets`);
            const allFacets = [...systemFacets, ...attributeFacets];
            // Sort by display priority
            allFacets.sort((a, b) => {
                const aPriority = a.facet_key === "price" ? 0 : a.display_priority || 999;
                const bPriority = b.facet_key === "price" ? 0 : b.display_priority || 999;
                return aPriority - bPriority;
            });
            const response = {
                category_id: categoryId,
                total_products: totalProducts,
                facets: allFacets,
                applied_filters: appliedFilters,
            };
            logger.info(`Successfully aggregated ${allFacets.length} facets for category ${categoryId}`);
            return response;
        }
        catch (error) {
            logger.error(`Error aggregating facets for category ${categoryId}: ${error instanceof Error ? error.message : String(error)}`);
            return {
                category_id: categoryId,
                total_products: 0,
                facets: [],
                applied_filters: appliedFilters,
            };
        }
    }
    aggregateAttributeFacet(facetConfig, baseProductAttributes, filteredProductAttributes, _appliedFilters) {
        try {
            const { key, label, config } = facetConfig;
            // Filter base attributes for this facet key (for all possible values)
            const relevantBaseAttributes = baseProductAttributes.filter((pa) => {
                const attributeValues = pa.attribute_values || {};
                return (attributeValues[key] !== undefined && attributeValues[key] !== null);
            });
            // Filter filtered attributes for this facet key (for counts)
            const relevantFilteredAttributes = filteredProductAttributes.filter((pa) => {
                const attributeValues = pa.attribute_values || {};
                return (attributeValues[key] !== undefined && attributeValues[key] !== null);
            });
            if (relevantBaseAttributes.length === 0) {
                return null;
            }
            // Use dedicated aggregators based on aggregation type
            switch (config.aggregation_type) {
                case "term":
                    return (0, aggregators_1.aggregateTermFacet)(key, label, relevantBaseAttributes, relevantFilteredAttributes, config);
                case "range":
                case "histogram":
                    return (0, aggregators_1.aggregateRangeFacet)(key, label, relevantBaseAttributes, relevantFilteredAttributes, config);
                case "boolean":
                    return (0, aggregators_1.aggregateBooleanFacet)(key, label, relevantBaseAttributes, relevantFilteredAttributes, config);
                default:
                    this.logger_.warn(`Unknown aggregation type: ${config.aggregation_type}`);
                    return null;
            }
        }
        catch (error) {
            this.logger_.error(`Error aggregating facet ${facetConfig.key}: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }
}
exports.default = FacetAggregationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQtYWdncmVnYXRpb24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtYXR0cmlidXRlcy9zZXJ2aWNlcy9mYWNldC1hZ2dyZWdhdGlvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscURBQStFO0FBQy9FLDBFQUcyQztBQUMzQyxnREFLd0I7QUFDeEIsOERBQWdGO0FBQ2hGLG9DQUFxRDtBQU9yRCxxRUFBZ0U7QUFFaEUsTUFBTSx1QkFBdUI7SUFLM0IsWUFBWSxTQUFjLEVBQUUsUUFBYztRQUN4QyxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSw2Q0FBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqRSw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTztnQkFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDO2dCQUNyRCxDQUFDLENBQUMsU0FBUyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQztRQUM3RCxDQUFDO1FBQUMsTUFBTSxDQUFDO1lBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDekIsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsb0JBQW9CLENBQ3hCLFVBQWtCLEVBQ2xCLFNBQWU7UUFFZixNQUFNLGVBQWUsR0FBRyxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNyRCxJQUFJLENBQUM7WUFDSCxrREFBa0Q7WUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBQSx5Q0FBb0IsRUFBQyxlQUFlLENBQUMsQ0FBQztZQUNwRCxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUEsc0NB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