"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const utils_1 = require("@medusajs/framework/utils");
const index_1 = require("src/modules/product-attributes/index");
const category_hierarchy_1 = require("src/utils/category-hierarchy");
class ProductsService {
    constructor(container) {
        this.container = container;
    }
    async getProductByHandle(params) {
        const { handle, region_id, currency_code } = params;
        const query = (0, category_hierarchy_1.resolveQueryInstance)(this.container);
        const logger = this.container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
        const result = await query.graph({
            entity: "product",
            fields: ["id", "product_attributes.*"],
            filters: { handle },
            context: {
                variants: {
                    calculated_price: (0, utils_1.QueryContext)({
                        region_id,
                        currency_code,
                    }),
                },
            },
        });
        const products = (result.data || []);
        if (products.length === 0) {
            return null;
        }
        const product = products[0];
        try {
            const productAttributesService = this.container.resolve(index_1.PRODUCT_ATTRIBUTES_MODULE);
            const productAttributes = await productAttributesService.listProductAttributes({
                product_id: [product.id],
            });
            logger.debug(`Retrieved ${productAttributes.length} product attributes for product ${product.id}`);
            const attributesData = productAttributes.find((attr) => attr.product_id === product.id);
            if (!attributesData) {
                return {
                    ...product,
                    product_attributes: {},
                };
            }
            // Get the attribute template to map raw values to labels
            const template = await productAttributesService.retrieveAttributeTemplate(attributesData.template_id);
            // Transform raw attribute_values to label/value pairs
            const formattedAttributes = {};
            if (template?.attribute_definitions && attributesData.attribute_values) {
                const templateDefinitions = template.attribute_definitions;
                if (Array.isArray(templateDefinitions)) {
                    for (const [key, value] of Object.entries(attributesData.attribute_values)) {
                        const definition = templateDefinitions.find((def) => def.key === key);
                        if (definition?.label && value !== null && value !== undefined) {
                            formattedAttributes[definition.label] = value;
                        }
                    }
                }
            }
            return {
                ...product,
                product_attributes: formattedAttributes,
            };
        }
        catch (error) {
            logger.error(`Error handling product attributes for product ${product.id}: ${error instanceof Error ? error.message : String(error)}`);
            return {
                ...product,
                product_attributes: {},
            };
        }
    }
}
exports.ProductsService = ProductsService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvc3RvcmUvcHJvZHVjdHMvc2VydmljZXMvcHJvZHVjdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFHbUM7QUFFbkMsZ0VBQWlGO0FBQ2pGLHFFQUFvRTtBQWVwRSxNQUFhLGVBQWU7SUFDMUIsWUFBb0IsU0FBMEI7UUFBMUIsY0FBUyxHQUFULFNBQVMsQ0FBaUI7SUFBRyxDQUFDO0lBRWxELEtBQUssQ0FBQyxrQkFBa0IsQ0FDdEIsTUFBNkI7UUFFN0IsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRXBELE1BQU0sS0FBSyxHQUFHLElBQUEseUNBQW9CLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhFLE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUMvQixNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUM7WUFDdEMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUU7b0JBQ1IsZ0JBQWdCLEVBQUUsSUFBQSxvQkFBWSxFQUFDO3dCQUM3QixTQUFTO3dCQUNULGFBQWE7cUJBQ2QsQ0FBQztpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBYyxDQUFDO1FBRWxELElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMx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