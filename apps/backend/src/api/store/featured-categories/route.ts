import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";
import { getAllCategoryIds } from "src/utils/category-hierarchy";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const regionId = req.headers["region_id"] as string;
    const currencyCode = req.headers["currency_code"] as string;

    if (!regionId || !currencyCode) {
      throw new Error("region_id and currency_code are required");
    }

    // Get query service
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

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
    const featuredCategories = categoriesResult.data.filter(
      (category) =>
        category.metadata?.["hero_image_url"] &&
        category.metadata?.["is_featured"] === true
    );

    // Sort by display_order from metadata
    featuredCategories.sort((a, b) => {
      const orderA = Number(a.metadata?.["display_order"]) || 0;
      const orderB = Number(b.metadata?.["display_order"]) || 0;
      return orderA - orderB;
    });

    const categoriesWithDetails = await Promise.all(
      featuredCategories.map(async (category) => {
        // Get all category IDs including child categories
        const categoryIds = await getAllCategoryIds(query, category.id);

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
          } as unknown as undefined,
          context: {
            variants: {
              calculated_price: QueryContext({
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
      })
    );

    res.json({
      featured_categories: categoriesWithDetails.filter(
        (category) => category.products.length > 0
      ),
    });
  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER);
    logger.error(
      `Error fetching featured categories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    res.status(500).json({
      error: "Failed to fetch featured categories",
    });
  }
}
