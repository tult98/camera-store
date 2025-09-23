"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryProductsSchema = void 0;
exports.POST = POST;
const utils_1 = require("@medusajs/framework/utils");
const category_products_validator_1 = require("./validation/category-products.validator");
Object.defineProperty(exports, "CategoryProductsSchema", { enumerable: true, get: function () { return category_products_validator_1.CategoryProductsSchema; } });
const category_product_service_1 = require("./services/category-product.service");
async function POST(req, res) {
    try {
        const requestData = req.validatedBody;
        const { category_id, page = 1, page_size = 24, order_by = "-created_at", filters = {}, search_query, } = requestData;
        const sanitizedCategoryId = category_products_validator_1.CategoryProductsValidator.validateCategoryId(category_id);
        const { region_id, currency_code } = category_products_validator_1.CategoryProductsValidator.validateHeaders(req.headers);
        const sanitizedSearchQuery = category_products_validator_1.CategoryProductsValidator.sanitizeSearchQuery(search_query);
        const params = {
            category_id: sanitizedCategoryId,
            page,
            page_size,
            order_by,
            filters,
            search_query: sanitizedSearchQuery,
            region_id,
            currency_code,
        };
        const categoryProductService = new category_product_service_1.CategoryProductService(req.scope);
        const result = await categoryProductService.getProductsByCategory(params);
        res.status(200).json(result);
    }
    catch (error) {
        const logger = req.scope.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error in POST /store/category-products: ${errorMessage}`);
        if (errorMessage.includes("category_id") || errorMessage.includes("headers")) {
            res.status(400).json({ error: errorMessage });
        }
        else if (errorMessage.includes("not found") || errorMessage.includes("invalid")) {
            res.status(404).json({ error: errorMessage });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2NhdGVnb3J5LXByb2R1Y3RzL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVVBLG9CQWlEQztBQXpERCxxREFBc0U7QUFHdEUsMEZBQTZHO0FBR3BHLHVHQUgyQixvREFBc0IsT0FHM0I7QUFGL0Isa0ZBQTZFO0FBSXRFLEtBQUssVUFBVSxJQUFJLENBQ3hCLEdBQTJDLEVBQzNDLEdBQW1CO0lBRW5CLElBQUksQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxhQUF3QyxDQUFDO1FBRWpFLE1BQU0sRUFDSixXQUFXLEVBQ1gsSUFBSSxHQUFHLENBQUMsRUFDUixTQUFTLEdBQUcsRUFBRSxFQUNkLFFBQVEsR0FBRyxhQUFhLEVBQ3hCLE9BQU8sR0FBRyxFQUFFLEVBQ1osWUFBWSxHQUNiLEdBQUcsV0FBVyxDQUFDO1FBRWhCLE1BQU0sbUJBQW1CLEdBQUcsdURBQXlCLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEYsTUFBTSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsR0FBRyx1REFBeUIsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVGLE1BQU0sb0JBQW9CLEdBQUcsdURBQXlCLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFekYsTUFBTSxNQUFNLEdBQTJCO1lBQ3JDLFdBQVcsRUFBRSxtQkFBbUI7WUFDaEMsSUFBSTtZQUNKLFNBQVM7WUFDVCxRQUFRO1lBQ1IsT0FBTztZQUNQLFlBQVksRUFBRSxvQkFBb0I7WUFDbEMsU0FBUztZQUNULGFBQWE7U0FDZCxDQUFDO1FBRUYsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGlEQUFzQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRSxNQUFNLE1BQU0sR0FBRyxNQUFNLHNCQUFzQixDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkUsTUFBTSxZQUFZLEdBQUcsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVFLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFeEUsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUM3RSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7YUFBTSxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ2xGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQzthQUFNLENBQUM7WUFDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7UUFDM0QsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIn0=