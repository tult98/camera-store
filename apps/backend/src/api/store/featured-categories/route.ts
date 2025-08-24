import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";

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

    // Get services
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
        // Get top 8 products from the category (simplified for now)
        const categoryProductsResult = await query.graph({
          entity: "product",
          fields: [
            "id",
            "title",
            "handle",
            "description",
            "thumbnail",
            "images.*",
            "variants.*",
            "variants.calculated_price.*",
          ],
          filters: {
            status: "published",
          },
          context: {
            variants: {
              calculated_price: QueryContext({
                region_id: regionId,
                currency_code: currencyCode,
              }),
            },
          },
        });

        const selectedProducts = categoryProductsResult.data.slice(0, 8);

        return {
          id: category.id,
          category_name: category.name,
          category_description: category.description,
          category_handle: category.handle,
          hero_image_url: category.metadata?.["hero_image_url"],
          display_order: Number(category.metadata?.["display_order"]) || 0,
          products: selectedProducts,
        };
      })
    );

    res.json({
      featured_categories: categoriesWithDetails,
    });
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    res.status(500).json({
      error: "Failed to fetch featured categories",
    });
  }
}
