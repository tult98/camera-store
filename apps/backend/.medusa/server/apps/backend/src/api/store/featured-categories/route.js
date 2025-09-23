"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
const category_hierarchy_1 = require("src/utils/category-hierarchy");
async function GET(req, res) {
    try {
        const regionId = req.headers["region_id"];
        const currencyCode = req.headers["currency_code"];
        if (!regionId || !currencyCode) {
            throw new Error("region_id and currency_code are required");
        }
        // Get query service
        const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
        // Get categories that have hero banners (stored in metadata)
        const categoriesResult = await query.graph({
            entity: "product_category",
            fields: ["id", "name", "description", "handle", "metadata"],
            filters: {
                is_active: true,
                parent_category_id: null, // Only top-level categories
            },
        });
        // Filter categories that have hero_image_url in metadata and is_featured = true
        const featuredCategories = categoriesResult.data.filter((category) => category.metadata?.["hero_image_url"] &&
            category.metadata?.["is_featured"] === true);
        // Sort by display_order from metadata
        featuredCategories.sort((a, b) => {
            const orderA = Number(a.metadata?.["display_order"]) || 0;
            const orderB = Number(b.metadata?.["display_order"]) || 0;
            return orderA - orderB;
        });
        const categoriesWithDetails = await Promise.all(featuredCategories.map(async (category) => {
            // Get all category IDs including child categories
            const categoryIds = await (0, category_hierarchy_1.getAllCategoryIds)(query, category.id);
            // Get top 8 products from the category and its children with calculated prices
            const productsResult = await query.graph({
                entity: "product",
                fields: [
                    "id",
                    "title",
                    "handle",
                    "status",
                    "description",
                    "images.*",
                    "variants.*",
                    "variants.calculated_price.*",
                    "thumbnail",
                ],
                filters: {
                    categories: { id: { $in: categoryIds } },
                    status: "published",
                },
                context: {
                    variants: {
                        calculated_price: (0, utils_1.QueryContext)({
                            region_id: regionId,
                            currency_code: currencyCode,
                        }),
                    },
                },
                pagination: {
                    take: 8,
                },
            });
            const productsWithPrices = productsResult.data || [];
            return {
                id: category.id,
                category_name: category.name,
                category_description: category.description,
                category_handle: category.handle,
                hero_image_url: category.metadata?.["hero_image_url"],
                display_order: Number(category.metadata?.["display_order"]) || 0,
                products: productsWithPrices,
            };
        }));
        res.json({
            featured_categories: categoriesWithDetails.filter((category) => category.products.length > 0),
        });
    }
    catch (error) {
        const logger = req.scope.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
        logger.error(`Error fetching featured categories: ${error instanceof Error ? error.message : "Unknown error"}`);
        res.status(500).json({
            error: "Failed to fetch featured categories",
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2ZlYXR1cmVkLWNhdGVnb3JpZXMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSxrQkF5R0M7QUEvR0QscURBR21DO0FBQ25DLHFFQUFpRTtBQUUxRCxLQUFLLFVBQVUsR0FBRyxDQUN2QixHQUFrQixFQUNsQixHQUFtQjtJQUVuQixJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBVyxDQUFDO1FBQ3BELE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFXLENBQUM7UUFFNUQsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsb0JBQW9CO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpFLDZEQUE2RDtRQUM3RCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN6QyxNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUM7WUFDM0QsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRSxJQUFJO2dCQUNmLGtCQUFrQixFQUFFLElBQUksRUFBRSw0QkFBNEI7YUFDdkQ7U0FDRixDQUFDLENBQUM7UUFFSCxnRkFBZ0Y7UUFDaEYsTUFBTSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUNyRCxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQ1gsUUFBUSxD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