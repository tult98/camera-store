"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFilterService = void 0;
const utils_1 = require("@medusajs/framework/utils");
const category_hierarchy_1 = require("../../../utils/category-hierarchy");
const index_1 = require("../index");
const DEFAULT_REGION_ID = "reg_01J9K0FDQZ8X3N8Q9NBXD5EKPK";
const DEFAULT_CURRENCY_CODE = "usd";
class ProductFilterService {
    constructor(container, _options) {
        this.container_ = container;
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
    /**
     * Get all products in a category and its child categories with pricing data
     */
    async getBaseProducts(categoryId, container, pricingContext) {
        const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
        // Get all category IDs including child categories
        const categoryIds = await (0, category_hierarchy_1.getAllCategoryIds)(query, categoryId);
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
                    calculated_price: (0, utils_1.QueryContext)({
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
    async getFilteredProducts(categoryId, appliedFilters, container, pricingContext) {
        const productAttributesService = container.resolve(index_1.PRODUCT_ATTRIBUTES_MODULE);
        // Get base products first
        let products = await this.getBaseProducts(categoryId, container, pricingContext);
        // If no filters applied, return all products
        if (Object.keys(appliedFilters).length === 0) {
            return products;
        }
        // Handle price filter (system facet) in memory
        const priceFilter = appliedFilters["price"];
        if (priceFilter) {
            products = this.filterByPrice(products, priceFilter);
        }
        // Handle attribute filters
        const attributeFilters = Object.entries(appliedFilters).filter(([key]) => key !== "price");
        if (attributeFilters.length === 0) {
            return products;
        }
        return await this.filterByAttributes(products, attributeFilters, productAttributesService);
    }
    /**
     * Filter products by price range
     */
    filterByPrice(products, priceFilter) {
        return products.filter((product) => {
            // Check if any variant matches the price filter
            return product.variants?.some((variant) => {
                const price = variant.calculated_price?.calculated_amount || 0;
                if (price === 0)
                    return false;
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
    async filterByAttributes(products, attributeFilters, productAttributesService) {
        const productIds = products.map((p) => p.id);
        // Get product attributes for filtering
        const productAttributes = await productAttributesService.listProductAttributes({
            product_id: productIds,
        });
        // Filter products based on attribute filters
        const filteredProductIds = new Set();
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
        return products.filter((p) => filteredProductIds.has(p.id));
    }
}
exports.ProductFilterService = ProductFilterService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1maWx0ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Byb2R1Y3QtYXR0cmlidXRlcy9zZXJ2aWNlcy9wcm9kdWN0LWZpbHRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUE2RjtBQUU3RiwwRUFBc0U7QUFDdEUsb0NBQXFEO0FBRXJELE1BQU0saUJBQWlCLEdBQUcsZ0NBQWdDLENBQUM7QUFDM0QsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLENBQUM7QUFFcEMsTUFBYSxvQkFBb0I7SUFJL0IsWUFBWSxTQUFjLEVBQUUsUUFBYztRQUN4QyxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUM1Qiw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTztnQkFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDO2dCQUNyRCxDQUFDLENBQUMsU0FBUyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQztRQUM3RCxDQUFDO1FBQUMsTUFBTSxDQUFDO1lBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDekIsQ0FBQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxlQUFlLENBQ25CLFVBQWtCLEVBQ2xCLFNBQWMsRUFDZCxjQUE2RDtRQUU3RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpFLGtEQUFrRDtRQUNsRCxNQUFNLFdBQVcsR0FBRyxNQUFNLElBQUEsc0NBQWlCLEVBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRS9ELHNFQUFzRTtRQUN0RSxNQUFNLE1BQU0sR0FB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