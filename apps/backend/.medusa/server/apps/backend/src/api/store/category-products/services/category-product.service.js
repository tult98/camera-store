"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryProductService = void 0;
const utils_1 = require("@medusajs/framework/utils");
const index_1 = require("src/modules/product-attributes/index");
const category_hierarchy_1 = require("src/utils/category-hierarchy");
const pagination_1 = require("src/utils/pagination");
const product_query_builder_service_1 = require("./product-query-builder.service");
const filter_pipeline_1 = require("../filters/filter-pipeline");
class CategoryProductService {
    constructor(container) {
        this.container = container;
    }
    async getProductsByCategory(params) {
        const { category_id, page, page_size, order_by, filters, search_query, region_id, currency_code, } = params;
        const query = (0, category_hierarchy_1.resolveQueryInstance)(this.container);
        const { itemsPerPage, offset } = {
            itemsPerPage: Math.min(Math.max(1, Number(page_size) || 24), 100),
            offset: (Math.max(1, Number(page) || 1) - 1) *
                Math.min(Math.max(1, Number(page_size) || 24), 100),
        };
        const categoryIds = await (0, category_hierarchy_1.getAllCategoryIds)(query, category_id);
        if (!categoryIds ||
            categoryIds.length === 0 ||
            categoryIds.some((id) => !id || typeof id !== "string")) {
            throw new Error("Category not found or invalid");
        }
        const context = {
            region_id,
            currency_code,
            categoryIds,
        };
        const queryFilters = product_query_builder_service_1.ProductQueryBuilderService.buildQueryFilters(categoryIds, filters);
        const sortOrder = product_query_builder_service_1.ProductQueryBuilderService.buildSortOrder(order_by);
        const graphQuery = product_query_builder_service_1.ProductQueryBuilderService.buildGraphQuery(queryFilters, sortOrder, context);
        const result = await query.graph(graphQuery);
        let products = (result.data || []);
        products = await this.attachProductAttributes(products);
        const pipeline = new filter_pipeline_1.FilterPipeline(products);
        const { products: processedProducts, totalCount } = pipeline
            .applySearch(search_query)
            .applyPriceFilter(filters.price)
            .applyAttributeFilters(filters)
            .applySorting(order_by)
            .getResults();
        const paginatedProducts = processedProducts.slice(offset, offset + itemsPerPage);
        return (0, pagination_1.toPaginatedResponse)(paginatedProducts, totalCount, itemsPerPage, offset);
    }
    async attachProductAttributes(products) {
        try {
            const logger = this.container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
            const productAttributesService = this.container.resolve(index_1.PRODUCT_ATTRIBUTES_MODULE);
            const productIds = products.map((p) => p.id);
            const productAttributes = await productAttributesService.listProductAttributes({
                product_id: productIds,
            });
            logger.debug(`Retrieved ${productAttributes.length} product attributes`);
            const attributesMap = new Map();
            for (const attr of productAttributes) {
                const attributeValues = attr.attribute_values?.reduce((acc, item) => {
                    acc[item.attribute_name] = item.value;
                    return acc;
                }, {}) || {};
                attributesMap.set(attr.product_id, attributeValues);
            }
            return products.map((product) => ({
                ...product,
                product_attributes: attributesMap.get(product.id) || {},
            }));
        }
        catch (error) {
            const logger = this.container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
            logger.error(`Error handling product attributes: ${error instanceof Error ? error.message : String(error)}`);
            return products;
        }
    }
}
exports.CategoryProductService = CategoryProductService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnktcHJvZHVjdC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9zdG9yZS9jYXRlZ29yeS1wcm9kdWN0cy9zZXJ2aWNlcy9jYXRlZ29yeS1wcm9kdWN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQXNFO0FBRXRFLGdFQUFpRjtBQUNqRixxRUFHc0M7QUFDdEMscURBQTJEO0FBUTNELG1GQUE2RTtBQUM3RSxnRUFBNEQ7QUFFNUQsTUFBYSxzQkFBc0I7SUFDakMsWUFBb0IsU0FBMEI7UUFBMUIsY0FBUyxHQUFULFNBQVMsQ0FBaUI7SUFBRyxDQUFDO0lBRWxELEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxNQUE4QjtRQUN4RCxNQUFNLEVBQ0osV0FBVyxFQUNYLElBQUksRUFDSixTQUFTLEVBQ1QsUUFBUSxFQUNSLE9BQU8sRUFDUCxZQUFZLEVBQ1osU0FBUyxFQUNULGFBQWEsR0FDZCxHQUFHLE1BQU0sQ0FBQztRQUVYLE1BQU0sS0FBSyxHQUFHLElBQUEseUNBQW9CLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEdBQUc7WUFDL0IsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztZQUNqRSxNQUFNLEVBQ0osQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxF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