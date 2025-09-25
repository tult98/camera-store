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
            fields: ["id"],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvc3RvcmUvcHJvZHVjdHMvc2VydmljZXMvcHJvZHVjdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFHbUM7QUFFbkMsZ0VBQWlGO0FBQ2pGLHFFQUFvRTtBQWVwRSxNQUFhLGVBQWU7SUFDMUIsWUFBb0IsU0FBMEI7UUFBMUIsY0FBUyxHQUFULFNBQVMsQ0FBaUI7SUFBRyxDQUFDO0lBRWxELEtBQUssQ0FBQyxrQkFBa0IsQ0FDdEIsTUFBNkI7UUFFN0IsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRXBELE1BQU0sS0FBSyxHQUFHLElBQUEseUNBQW9CLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhFLE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUMvQixNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDZCxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUU7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLFFBQVEsRUFBRTtvQkFDUixnQkFBZ0IsRUFBRSxJQUFBLG9CQUFZLEVBQUM7d0JBQzdCLFNBQVM7d0JBQ1QsYUFBYTtxQkFDZCxDQUFDO2lCQUNIO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFjLENBQUM7UUFFbEQsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQzFCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1QixJQUFJLENBQUM7WUFDSCxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUNyRCxpQ0FBeUIsQ0FDMUIsQ0FBQztZQUVGLE1BQU0saUJBQWlCLEdBQ3JCLE1BQU0sd0JBQXdCLENBQUMscUJBQXFCLENBQUM7Z0JBQ25ELFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFDekIsQ0FBQyxDQUFDO1lBRUwsTUFBTSxDQUFDLEtBQUssQ0FDVixhQUFhLGlCQUFpQixDQUFDLE1BQU0sbUNBQW1DLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FDckYsQ0FBQztZQUVGLE1BQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FDM0MsQ0FBQyxJQUEwQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQyxFQUFFLENBQy9ELENBQUM7WUFFRixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3BCLE9BQU87b0JBQ0wsR0FBRyxPQUFPO29CQUNWLGtCQUFrQixFQUFFLEVBQUU7aUJBQ3ZCLENBQUM7WUFDSixDQUFDO1lBRUQseURBQXlEO1lBQ3pELE1BQU0sUUFBUSxHQUFHLE1BQU0sd0JBQXdCLENBQUMseUJBQXlCLENBQ3ZFLGNBQWMsQ0FBQyxXQUFXLENBQzNCLENBQUM7WUFFRixzREFBc0Q7WUFDdEQsTUFBTSxtQkFBbUIsR0FBNEIsRUFBRSxDQUFDO1lBQ3hELElBQUksUUFBUSxFQUFFLHFCQUFxQixJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN2RSxNQUFNLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDM0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQztvQkFDdkMsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQ3ZDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FDaEMsRUFBRSxDQUFDO3dCQUNGLE1BQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FDekMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUM5QixDQUFDO3dCQUVGLElBQUksVUFBVSxFQUFFLEtBQUssSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsQ0FBQzs0QkFDL0QsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQzt3QkFDaEQsQ0FBQztvQkFDSCxDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1lBRUQsT0FBTztnQkFDTCxHQUFHLE9BQU87Z0JBQ1Ysa0JBQWtCLEVBQUUsbUJBQW1CO2FBQ3hDLENBQUM7UUFDSixDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sQ0FBQyxLQUFLLENBQ1YsaURBQWlELE9BQU8sQ0FBQyxFQUFFLEtBQ3pELEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ3ZELEVBQUUsQ0FDSCxDQUFDO1lBQ0YsT0FBTztnQkFDTCxHQUFHLE9BQU87Z0JBQ1Ysa0JBQWtCLEVBQUUsRUFBRTthQUN2QixDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7Q0FDRjtBQWxHRCwwQ0FrR0MifQ==